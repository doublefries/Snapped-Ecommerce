import { getAllProducts } from "@/lib/db/queries";
import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all products from Snapped - Premium apparel and accessories",
};

export default async function ShopPage() {
  let products;
  let error: string | null = null;

  try {
    products = await getAllProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
    error = err instanceof Error ? err.message : "Failed to load products";
    products = [];
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase text-center">SHOP ALL PRODUCTS</h1>
      
      {error ? (
        <div className="text-center py-12 max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Database Connection Error</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <p className="text-gray-700 text-sm">
              Please make sure your database is set up. Check <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_SETUP.md</code> for instructions.
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products available at the moment.</p>
          <p className="text-gray-500 text-sm">
            Run <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code> to add sample products.
          </p>
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
