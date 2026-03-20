import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Supabase Storage: bucket "product-images", subfolders beanies, hoodies, tees, truckers
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageBase = supabaseUrl
  ? `${supabaseUrl}/storage/v1/object/public/product-images`
  : null;

function supabaseImage(folder: string, filename: string): string {
  if (storageBase) {
    const objectPath = `${folder}/${filename}`;
    return `${storageBase}/${objectPath}`;
  }
  return `https://via.placeholder.com/800x800?text=${encodeURIComponent(filename)}`;
}

async function main() {
  console.log("Seeding database...");

  function buildVariants(params: {
    colors?: Array<{ name: string; value: string; stockQty: number }>;
    sizes: Array<{ name: string; value: string }>;
  }) {
    const colors =
      params.colors && params.colors.length > 0
        ? params.colors
        : [{ name: "DEFAULT", value: "default", stockQty: 0 }];

    return colors.flatMap((color) => {
      const sizeCount = Math.max(params.sizes.length, 1);
      const base = Math.floor((color.stockQty ?? 0) / sizeCount);
      let remainder = (color.stockQty ?? 0) - base * sizeCount;

      return params.sizes.map((size) => {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) remainder -= 1;
        return {
          colorName: color.name,
          colorValue: color.value,
          sizeName: size.name,
          sizeValue: size.value,
          stockQty: base + extra,
        };
      });
    });
  }

  const products = [
    {
      name: "EMBOSSED HOODIE 2.0",
      slug: "embossed-hoodie-2-0",
      description: "- Premium 320GSM heavyweight hoodie\n- \"SNAPPED\" text embossed on hood\n\nWASHING INSTRUCTIONS:\n- Wash on COLD & hand-dry for maximum longevity\n - Do NOT machine dry when wet",
      price: 75.0,
      salePrice: 60.0,
      images: [
        supabaseImage("hoodies", "cover-purple-embossed.png"),
        supabaseImage("hoodies", "forestgreen-embossed.JPG"),
        // Include variant-focused images in gallery thumbnails
        supabaseImage("hoodies", "banner-blue.png"),
        supabaseImage("hoodies", "pink-embossed.jpg"),
        supabaseImage("hoodies", "purple-embossed.png"),
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
      variants: buildVariants({
        colors: [
          { name: "GREEN", value: "green", stockQty: 13 },
          { name: "NAVY", value: "navy", stockQty: 12 },
          { name: "PINK", value: "pink", stockQty: 13 },
          { name: "PURPLE", value: "purple", stockQty: 12 },
        ],
        sizes: [
          { name: "S", value: "s" },
          { name: "M", value: "m" },
          { name: "L", value: "l" },
          { name: "XL", value: "xl" },
        ],
      }),
    },
    {
      name: "PATCH BEANIES",
      slug: "patch-beanies",
      description: "- 100% acrylic beanie\n- Woven patch with our iconic Snapped logo",
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
      variants: buildVariants({
        colors: [
          { name: "BROWN", value: "brown", stockQty: 25 },
          { name: "BLUE", value: "blue", stockQty: 25 },
          { name: "BLACK", value: "black", stockQty: 25 },
          { name: "PINK", value: "pink", stockQty: 25 },
        ],
        sizes: [{ name: "OS", value: "os" }],
      }),
    },
    {
      name: "TRUCKER (BLUE/CREAM)",
      slug: "trucker-blue-cream",
      description: "- Super high quality corduroy & mesh construction\n- Front, side, and rear embroidered logos\n- Adjustable trucker-style fit",
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
      variants: buildVariants({
        sizes: [{ name: "OS", value: "os" }],
      }),
    },
    {
      name: "TRUCKER (BLACK/CREAM)",
      slug: "trucker-black-cream",
      description: "- Super high quality corduroy & mesh construction\n- Front, side, and rear embroidered logos\n- Adjustable trucker-style fit",
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
      variants: buildVariants({
        sizes: [{ name: "OS", value: "os" }],
      }),
    },
    {
      name: "WASHED T-SHIRT",
      slug: "washed-t-shirt",
      description: "- 100% Cotton\n- Garment-Dyed\n\nWASHING INSTRUCTIONS:\n- Wash on COLD & hand-dry for maximum longevity\n - Do NOT machine dry when wet",
      price: 30.0,
      images: [
        supabaseImage("tees", "tee-front-black.png"),
        supabaseImage("tees", "tee-back-black.png"),
        supabaseImage("tees", "tee-h-black.png"),
        supabaseImage("tees", "throwing.png"),
        supabaseImage("tees", "tee-t-black.png")
      ],
      variantImages: null,
      category: "T-Shirts",
      inStock: true,
      stockQty: 40,
      variants: buildVariants({
        sizes: [
          { name: "S", value: "s" },
          { name: "M", value: "m" },
          { name: "L", value: "l" },
          { name: "XL", value: "xl" },
        ],
      }),
    },
  ];

  for (const productData of products) {
    const { variants, variantImages, ...productInfo } = productData;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        // Keep core product fields in sync with seed data
        name: productData.name,
        description: productData.description,
        price: productData.price,
        salePrice: productData.salePrice ?? undefined,
        category: productData.category,
        inStock: productData.inStock,
        stockQty: productData.stockQty,
        images: productData.images,
        variantImages: variantImages ?? undefined,
        variants: {
          // Reseeding should sync variants for existing products too
          deleteMany: {},
          create: variants,
        },
      },
      create: {
        ...productInfo,
        variantImages: variantImages ?? undefined,
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
