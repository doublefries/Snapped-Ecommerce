import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/db/queries";
import { CartItem } from "@/lib/types";
import Stripe from "stripe";

function parseShippingRateId(raw: string | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  const id = raw.trim().replace(/^['"]+|['"]+$/g, "");
  return id.startsWith("shr_") ? id : null;
}

/** Up to two `shr_...` IDs: Pickup then Standard (Dashboard shipping rates). */
function shippingRateIdsFromEnv(): string[] {
  const idsRaw = process.env.STRIPE_SHIPPING_RATE_IDS;
  if (idsRaw) {
    const list: string[] = [];
    for (const segment of idsRaw.split(/[,;\n]+/)) {
      const id = parseShippingRateId(segment);
      if (id && !list.includes(id)) list.push(id);
      if (list.length >= 2) break;
    }
    if (list.length > 0) return list;
  }

  const list: string[] = [];
  const pickup = parseShippingRateId(process.env.STRIPE_SHIPPING_RATE_PICKUP);
  const standard = parseShippingRateId(process.env.STRIPE_SHIPPING_RATE_STANDARD);
  if (pickup) list.push(pickup);
  if (standard) list.push(standard);
  return list.slice(0, 2);
}

/** Two options only: Pickup, then Standard — Dashboard `shr_` rates or inline CAD if `STRIPE_USE_INLINE_SHIPPING=1`. */
function checkoutShippingOptions(): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const rateIds = shippingRateIdsFromEnv();
  if (rateIds.length > 0) {
    return rateIds.map((shipping_rate) => ({ shipping_rate }));
  }

  const useInline =
    process.env.STRIPE_USE_INLINE_SHIPPING === "1" ||
    process.env.STRIPE_USE_INLINE_SHIPPING === "true";
  if (!useInline) return [];

  const pickupCents = Number(process.env.STRIPE_INLINE_SHIPPING_PICKUP_CENTS ?? "0");
  const standardCents = Number(process.env.STRIPE_INLINE_SHIPPING_STANDARD_CENTS ?? "1500");
  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: pickupCents, currency: "cad" },
        display_name: "Pickup",
      },
    },
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: standardCents, currency: "cad" },
        display_name: "Standard shipping",
      },
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email } = body;

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch current product data and build line items
    const lineItems = await Promise.all(
      items.map(async (item: CartItem) => {
        const product = await getProductById(item.productId);
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        // Use current price from database (sale price if available)
        const price = product.salePrice ?? product.price;

        // Build image URL: use as-is if already absolute (https), else prepend app URL
        const rawImage = product.images[0];
        const imageUrl =
          rawImage && rawImage.startsWith("http")
            ? rawImage
            : process.env.NEXT_PUBLIC_APP_URL
              ? `${process.env.NEXT_PUBLIC_APP_URL}${rawImage?.startsWith("/") ? rawImage : `/${rawImage}`}`
              : null;
        // Stripe requires HTTPS; only send image if it's a valid URL
        const images =
          imageUrl && (imageUrl.startsWith("https://") || imageUrl.startsWith("http://localhost"))
            ? [imageUrl]
            : [];

        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: product.name,
              description:
                item.colorName && item.colorValue !== "default"
                  ? item.sizeName && item.sizeValue !== "os"
                    ? `${product.name} - ${item.colorName} / ${item.sizeName}`
                    : `${product.name} - ${item.colorName}`
                  : item.sizeName && item.sizeValue !== "os"
                    ? `${product.name} - ${item.sizeName}`
                    : product.name,
              images,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      })
    );

    const shippingOptions = checkoutShippingOptions();

    if (shippingOptions.length === 0) {
      console.warn(
        "[checkout] No shipping_options: set STRIPE_SHIPPING_RATE_PICKUP + STRIPE_SHIPPING_RATE_STANDARD (or STRIPE_SHIPPING_RATE_IDS=shr_pickup,shr_standard), or STRIPE_USE_INLINE_SHIPPING=1. Test/live must match your secret key."
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: email,
      ...(shippingOptions.length > 0
        ? {
            shipping_address_collection: {
              allowed_countries: ["CA", "US"],
            },
            shipping_options: shippingOptions,
          }
        : {}),
      metadata: {
        // Store cart items in metadata for webhook processing
        cartItems: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      url: session.url,
      ...(process.env.NODE_ENV === "development" && shippingOptions.length === 0
        ? {
            _devShipping:
              "Session has no shipping_options. Set STRIPE_SHIPPING_RATE_PICKUP + STRIPE_SHIPPING_RATE_STANDARD (or STRIPE_SHIPPING_RATE_IDS), or STRIPE_USE_INLINE_SHIPPING=1; restart dev server.",
          }
        : {}),
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
