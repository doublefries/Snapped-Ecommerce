import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Supabase Storage: bucket "product-images", subfolders beanies, hoodies, tees, truckers
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageBase = supabaseUrl
  ? `${supabaseUrl}/storage/v1/object/public/product-images`
  : null;

function supabaseImage(folder: string, filename: string): string {
  if (storageBase) return `${storageBase}/${folder}/${filename}`;
  return `https://via.placeholder.com/800x800?text=${encodeURIComponent(filename)}`;
}

async function main() {
  console.log("Seeding database...");

  const products = [
    {
      name: "EMBOSSED HOODIE 2.0",
      slug: "embossed-hoodie-2-0",
      description: "Premium hoodie with embossed design",
      price: 75.0,
      salePrice: 60.0,
      images: [
        supabaseImage("hoodies", "cover-purple-embossed.png"),
        supabaseImage("hoodies", "forestgreen-embossed.JPG"),
      ],
      variantImages: {
        green: supabaseImage("hoodies", "forestgreen-embossed.JPG"),
        navy: supabaseImage("hoodies", "banner-blue.png"), // NAVY and BLUE are the same colour → one image
        pink: supabaseImage("hoodies", "pink-embossed.jpg"),
        purple: supabaseImage("hoodies", "purple-embossed.png"),
      },
      category: "Hoodies",
      inStock: true,
      stockQty: 50,
      variants: [
        { name: "GREEN", value: "green", stockQty: 13 },
        { name: "NAVY", value: "navy", stockQty: 12 },
        { name: "PINK", value: "pink", stockQty: 13 },
        { name: "PURPLE", value: "purple", stockQty: 12 },
      ],
    },
    {
      name: "PATCH BEANIES",
      slug: "patch-beanies",
      description: "100% acrylic beanie with woven patch featuring our iconic Snapped logo",
      price: 25.0,
      salePrice: 15.0,
      images: [
        supabaseImage("beanies", "beanies-cover.png"),
        supabaseImage("beanies", "beanies-ht.png"),
        supabaseImage("beanies", "brown.png"),
        supabaseImage("beanies", "blue.png"),
        supabaseImage("beanies", "black.png"),
        supabaseImage("beanies", "pink.png"),
        supabaseImage("beanies", "additional.png"),
      ],
      variantImages: {
        brown: supabaseImage("beanies", "brown.png"),
        blue: supabaseImage("beanies", "blue.png"),
        black: supabaseImage("beanies", "black.png"),
        pink: supabaseImage("beanies", "pink.png"),
      },
      category: "Accessories",
      inStock: true,
      stockQty: 100,
      variants: [
        { name: "BROWN", value: "brown", stockQty: 25 },
        { name: "BLUE", value: "blue", stockQty: 25 },
        { name: "BLACK", value: "black", stockQty: 25 },
        { name: "PINK", value: "pink", stockQty: 25 },
      ],
    },
    {
      name: "TRUCKER (BLUE/CREAM)",
      slug: "trucker-blue-cream",
      description: "Classic trucker hat with blue mesh back and cream corduroy front",
      price: 35.0,
      images: [
        supabaseImage("truckers", "blue-front.png"),
        supabaseImage("truckers", "side-blue.png"),
        supabaseImage("truckers", "t-back2.png"),
        supabaseImage("truckers", "blue-waves.png"),
        supabaseImage("truckers", "back-blue.png"),
        supabaseImage("truckers", "t-back1.png"),
      ],
      variantImages: null,
      category: "Hats",
      inStock: true,
      stockQty: 30,
      variants: [],
    },
    {
      name: "TRUCKER (BLACK/CREAM)",
      slug: "trucker-black-cream",
      description: "Classic trucker hat with black mesh back and cream corduroy front",
      price: 35.0,
      images: [
        supabaseImage("truckers", "black-front.png"),
        supabaseImage("truckers", "black-side.png"),
        supabaseImage("truckers", "h-back1.png"),
        supabaseImage("truckers", "back-black.png"),
        supabaseImage("truckers", "h-back2.png"),
      ],
      variantImages: null,
      category: "Hats",
      inStock: true,
      stockQty: 30,
      variants: [],
    },
    {
      name: "WASHED T-SHIRT",
      slug: "washed-t-shirt",
      description: "Vintage washed t-shirt with skeleton design",
      price: 30.0,
      images: [
        supabaseImage("tees", "tee-front-black.png"),
        supabaseImage("tees", "tee-back-black.png"),
        supabaseImage("tees", "tee-h-black.png"),
        supabaseImage("tees", "throwing.png"),
        supabaseImage("tees", "tee-h-black.png"),
      ],
      variantImages: null,
      category: "T-Shirts",
      inStock: true,
      stockQty: 40,
      variants: [],
    },
  ];

  for (const productData of products) {
    const { variants, variantImages, ...productInfo } = productData;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        images: productData.images,
        variantImages: variantImages === null ? null : variantImages,
      },
      create: {
        ...productInfo,
        variantImages: variantImages === null ? null : variantImages,
        variants: {
          create: variants,
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
