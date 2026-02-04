import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create products based on the design
  const products = [
    {
      name: "EMBOSSED HOODIE 2.0",
      slug: "embossed-hoodie-2-0",
      description: "Premium hoodie with embossed design",
      price: 75.0,
      salePrice: 60.0,
      images: ["https://via.placeholder.com/800x800?text=Hoodie"],
      category: "Hoodies",
      inStock: true,
      stockQty: 50,
      variants: [],
    },
    {
      name: "PATCH BEANIES",
      slug: "patch-beanies",
      description: "100% acrylic beanie with woven patch featuring our iconic Snapped logo",
      price: 25.0,
      salePrice: 15.0,
      images: ["https://via.placeholder.com/800x800?text=Beanies"],
      category: "Accessories",
      inStock: true,
      stockQty: 100,
      variants: [
        { name: "NAVY", value: "navy", stockQty: 25 },
        { name: "BROWN", value: "brown", stockQty: 25 },
        { name: "BLACK", value: "black", stockQty: 25 },
        { name: "PINK", value: "pink", stockQty: 25 },
      ],
    },
    {
      name: "TRUCKER (BLUE/CREAM)",
      slug: "trucker-blue-cream",
      description: "Classic trucker hat with blue mesh back and cream corduroy front",
      price: 35.0,
      images: ["https://via.placeholder.com/800x800?text=Trucker+Blue"],
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
      images: ["https://via.placeholder.com/800x800?text=Trucker+Black"],
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
      images: ["https://via.placeholder.com/800x800?text=T-Shirt"],
      category: "T-Shirts",
      inStock: true,
      stockQty: 40,
      variants: [],
    },
  ];

  for (const productData of products) {
    const { variants, ...productInfo } = productData;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productInfo,
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
