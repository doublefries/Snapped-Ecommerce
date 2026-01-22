import { getAllProducts } from "@/lib/db/queries";
import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all products from Snapped - Premium apparel and accessories",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase text-center">SHOP ALL PRODUCTS</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
