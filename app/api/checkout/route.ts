import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/db/queries";
import { CartItem } from "@/lib/types";

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
              description: item.variantName
                ? `${product.name} - ${item.variantName}`
                : product.name,
              images,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      })
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: email,
      metadata: {
        // Store cart items in metadata for webhook processing
        cartItems: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
