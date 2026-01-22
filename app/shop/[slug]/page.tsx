import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db/queries";
import ProductImage from "@/components/product/ProductImage";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description || `Shop ${product.name} from Snapped`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Product Images */}
        <div>
          <ProductImage images={product.images} productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-4 uppercase">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              {hasSale && (
                <span className="text-gray-500 line-through text-xl">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-2xl font-bold">
                {formatPrice(displayPrice)}
              </span>
            </div>
          </div>

          {/* Client Component for Interactive Elements */}
          <ProductDetailClient product={product} />

          {/* Product Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-3 uppercase">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
