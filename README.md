# Custom E-Commerce Store for Snapped Streetwear

After years of paying for an extremely expensive Shopify subscription, of which I used
probably 5% of the included features, I decided to free my wallet and take a
crack at building my own E-Commerce solution. Does it have all the features Shopify has?
Absolutely not. But I am one person and not a team of hundreds, and it has all the 
functionality I used previously anyways. Most importantly, it's free!

## How I built it:

### Tech Stack:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **State Management**: Zustand
- **Payments**: Stripe Checkout
- **Icons**: Lucide React

## Features:

- **Product Catalog**: Browse products with variants (colors, sizes)
- **Shopping Cart**: Persistent cart with local storage
- **Product Details**: Image carousel, variant selection, quantity controls
- **Checkout**: Secure payment processing via Stripe
- **Order Management**: Webhook-based order confirmation
- **Responsive Design**: Mobile-first, minimalist aesthetic
- **SEO Optimized**: Metadata and structured data

## Future Plans:
- Hoping to add admin-facing view to update product details/quantities, create new products, etc. Works fine for me currently to update db directly, but plan to add this GUI for my less tech-savvy business partner to interact with.
