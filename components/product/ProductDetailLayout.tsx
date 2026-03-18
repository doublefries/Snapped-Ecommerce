"use client";

import { useState, useCallback } from "react";
import { Product } from "@/lib/types";
import ProductImage from "./ProductImage";
import ProductDetailClient from "./ProductDetailClient";
import { formatPrice } from "@/lib/utils";

interface ProductDetailLayoutProps {
  product: Product;
}

function getInitialImageIndex(
  product: Product,
  firstVariantValue: string | null
): number {
  if (firstVariantValue && product.variantImages?.[firstVariantValue]) {
    const url = product.variantImages[firstVariantValue];
    const i = product.images.indexOf(url);
    if (i >= 0) return i;
  }
  return 0;
}

export default function ProductDetailLayout({
  product,
}: ProductDetailLayoutProps) {
  const firstVariantValue =
    product.variants.length > 0 ? product.variants[0].colorValue : null;
  const [selectedVariantValue, setSelectedVariantValue] = useState<
    string | null
  >(firstVariantValue);
  const [selectedImageIndex, setSelectedImageIndex] = useState(() =>
    getInitialImageIndex(product, firstVariantValue)
  );

  const handleSelectImageIndex = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handleSelectVariant = useCallback(
    (value: string) => {
      setSelectedVariantValue(value);
      const variantImageUrl = product.variantImages?.[value];
      if (variantImageUrl && product.images.includes(variantImageUrl)) {
        const index = product.images.indexOf(variantImageUrl);
        setSelectedImageIndex(index);
      }
    },
    [product.variantImages, product.images]
  );

  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      <div>
        <ProductImage
          images={product.images}
          productName={product.name}
          selectedImageIndex={selectedImageIndex}
          onSelectImageIndex={handleSelectImageIndex}
        />
      </div>

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

        <ProductDetailClient
          product={product}
          selectedVariantValue={selectedVariantValue}
          onSelectVariant={handleSelectVariant}
        />

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
  );
}
