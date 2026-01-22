import { prisma } from "./prisma";
import { Product, ProductVariant } from "@/lib/types";

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  })) as Product[];
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  } as Product;
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  } as Product;
}

// Get variant by product ID and value
export async function getVariantByValue(
  productId: string,
  value: string
): Promise<ProductVariant | null> {
  const variant = await prisma.productVariant.findUnique({
    where: {
      productId_value: {
        productId,
        value,
      },
    },
  });

  return variant as ProductVariant | null;
}
