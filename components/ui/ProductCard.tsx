"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, isNonOptimizableImageSrc } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== null;
  const coverUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
  const hoverUrl = Array.isArray(product.images) && product.images.length > 1 ? product.images[1] : null;
  const coverUnoptimized = !!coverUrl && isNonOptimizableImageSrc(coverUrl);
  const hoverUnoptimized = !!hoverUrl && isNonOptimizableImageSrc(hoverUrl);

  return (
    <Link href={`/shop/${product.slug}`} className="group">
      <div className="flex flex-col">
        {/* Product Image: cover by default, hover image on hover */}
        <div className="relative w-full aspect-square border border-black mb-4 overflow-hidden bg-gray-100">
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={80}
                unoptimized={coverUnoptimized}
              />
              {hoverUrl && (
                <Image
                  src={hoverUrl}
                  alt={product.name}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                  aria-hidden
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  quality={80}
                  unoptimized={hoverUnoptimized}
                />
              )}
            </>
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
