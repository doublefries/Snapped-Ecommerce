import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/prisma";
import { CartItem } from "@/lib/types";
import Stripe from "stripe";

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
      // Parse cart items from metadata
      const cartItems: CartItem[] = JSON.parse(
        session.metadata?.cartItems || "[]"
      );

      if (cartItems.length === 0) {
        console.error("No cart items in session metadata");
        return NextResponse.json(
          { error: "No items in order" },
          { status: 400 }
        );
      }

      // Calculate total from cart items
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order in database
      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          email: session.customer_email || session.customer_details?.email || "",
          total: total,
          status: "PAID",
          shippingAddress: session.shipping_details
            ? {
                name: session.shipping_details.name,
                address: session.shipping_details.address,
              }
            : null,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              variantName: item.variantName || null,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock quantities
      for (const item of cartItems) {
        // Update main product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity,
            },
          },
        });

        // If item has a variant, update variant stock
        if (item.variantName) {
          // Find variant by product ID and variant name
          const variant = await prisma.productVariant.findFirst({
            where: {
              productId: item.productId,
              name: item.variantName,
            },
          });

          if (variant) {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: {
                stockQty: {
                  decrement: item.quantity,
                },
              },
            });
          }
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
