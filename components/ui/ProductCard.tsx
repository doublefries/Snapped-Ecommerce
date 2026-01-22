"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== null;

  return (
    <Link href={`/shop/${product.slug}`} className="group">
      <div className="flex flex-col">
        {/* Product Image */}
        <div className="relative w-full aspect-square border border-black mb-4 overflow-hidden bg-gray-100">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <p>No Image</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h3 className="text-lg font-medium mb-2 uppercase">{product.name}</h3>
          <div className="flex items-center gap-2">
            {hasSale && (
              <span className="text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="font-semibold">{formatPrice(displayPrice)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
