import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { CartItem } from "@/lib/types";
import Stripe from "stripe";

type ResolvedOrderLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
};

type VariantRow = {
  colorName: string;
  colorValue: string;
  sizeName: string;
  sizeValue: string;
};

function isActiveStripeProduct(
  p: Stripe.Product | Stripe.DeletedProduct
): p is Stripe.Product {
  return !("deleted" in p && p.deleted);
}

function variantLabel(v: VariantRow): string | null {
  if (v.colorValue !== "default") {
    if (v.sizeValue !== "os") return `${v.colorName} / ${v.sizeName}`;
    return v.colorName;
  }
  if (v.sizeValue !== "os") return v.sizeName;
  return null;
}

async function resolveLinesFromStripe(
  sessionId: string
): Promise<ResolvedOrderLine[]> {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const lines: ResolvedOrderLine[] = [];

  for (const li of lineItems.data) {
    const price = li.price;
    if (!price || typeof price === "string") continue;
    let stripeProduct: Stripe.Product | null = null;
    const productRef = price.product;
    if (!productRef) continue;
    if (typeof productRef === "string") {
      try {
        const p = await stripe.products.retrieve(productRef);
        if (isActiveStripeProduct(p)) stripeProduct = p;
      } catch {
        continue;
      }
    } else if (isActiveStripeProduct(productRef)) {
      stripeProduct = productRef;
    }
    if (!stripeProduct) continue;

    const productId =
      stripeProduct.metadata?.product_id ??
      stripeProduct.metadata?.productId;
    if (!productId) continue;

    const variantIdRaw =
      stripeProduct.metadata?.variant_id ??
      stripeProduct.metadata?.variantId;
    const variantId =
      variantIdRaw && variantIdRaw.length > 0 ? variantIdRaw : null;

    const qty = li.quantity ?? 0;
    if (qty < 1) continue;

    const lineCents = li.amount_total ?? 0;
    const unitPrice = lineCents / qty / 100;

    lines.push({
      productId,
      variantId,
      quantity: qty,
      unitPrice,
    });
  }

  return lines;
}

function linesFromLegacyMetadata(
  session: Stripe.Checkout.Session
): ResolvedOrderLine[] | null {
  const raw = session.metadata?.cartItems;
  if (!raw || typeof raw !== "string") return null;
  try {
    const cartItems: CartItem[] = JSON.parse(raw);
    if (!Array.isArray(cartItems) || cartItems.length === 0) return null;
    return cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
      unitPrice: item.price,
    }));
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      let resolved = await resolveLinesFromStripe(session.id);
      if (resolved.length === 0) {
        resolved = linesFromLegacyMetadata(session) ?? [];
      }

      if (resolved.length === 0) {
        console.error("No cart items: line items missing product_id or legacy metadata");
        return NextResponse.json(
          { error: "No items in order" },
          { status: 400 }
        );
      }

      const itemRows = await Promise.all(
        resolved.map(async (line) => {
          const product = await prisma.product.findUnique({
            where: { id: line.productId },
          });
          if (!product) {
            throw new Error(`Product ${line.productId} not found`);
          }
          let variantName: string | null = null;
          if (line.variantId) {
            const variant = await prisma.productVariant.findUnique({
              where: { id: line.variantId },
            });
            if (variant) variantName = variantLabel(variant);
          }
          return {
            productId: line.productId,
            productName: product.name,
            variantName,
            quantity: line.quantity,
            price: line.unitPrice,
            variantId: line.variantId,
          };
        })
      );

      const total = itemRows.reduce(
        (sum, row) => sum + row.price * row.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          email: session.customer_email || session.customer_details?.email || "",
          total: total,
          status: "PAID",
          shippingAddress: session.customer_details?.address
            ? {
                name: session.customer_details.name,
                address: {
                  line1: session.customer_details.address.line1,
                  line2: session.customer_details.address.line2,
                  city: session.customer_details.address.city,
                  state: session.customer_details.address.state,
                  postal_code: session.customer_details.address.postal_code,
                  country: session.customer_details.address.country,
                },
              }
            : undefined,
          items: {
            create: itemRows.map((row) => ({
              productId: row.productId,
              productName: row.productName,
              variantName: row.variantName,
              quantity: row.quantity,
              price: row.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const row of itemRows) {
        await prisma.product.update({
          where: { id: row.productId },
          data: {
            stockQty: {
              decrement: row.quantity,
            },
          },
        });

        if (row.variantId) {
          await prisma.productVariant.update({
            where: { id: row.variantId },
            data: {
              stockQty: {
                decrement: row.quantity,
              },
            },
          });
        }
      }

      console.log(`Order created: ${order.id}`);
      return NextResponse.json({ received: true, orderId: order.id });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  }

  // Return 200 for other event types (acknowledge receipt)
  return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const runtime = "nodejs";

// Route segment config - disable body parsing
export const dynamic = "force-dynamic";
