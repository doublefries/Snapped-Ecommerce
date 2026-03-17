"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/lib/types";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "@/components/ui/QuantitySelector";
import AddToCartButton from "./AddToCartButton";

interface ProductDetailClientProps {
  product: Product;
  selectedVariantValue?: string | null;
  onSelectVariant?: (value: string) => void;
}

export default function ProductDetailClient({
  product,
  selectedVariantValue: controlledVariant,
  onSelectVariant,
}: ProductDetailClientProps) {
  const [internalVariant, setInternalVariant] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].value : null
  );
  const selectedVariantValue =
    controlledVariant !== undefined ? controlledVariant : internalVariant;
  const setSelectedVariantValue =
    onSelectVariant ?? setInternalVariant;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const selectedVariant: ProductVariant | null =
    selectedVariantValue
      ? product.variants.find((v) => v.value === selectedVariantValue) || null
      : null;

  const maxQuantity = selectedVariant
    ? selectedVariant.stockQty
    : product.stockQty;

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selector */}
      {product.variants.length > 0 && (
        <ColorSelector
          variants={product.variants}
          selectedValue={selectedVariantValue}
          onSelect={setSelectedVariantValue}
        />
      )}

      {/* Size Selector (hoodies only for now) */}
      {product.slug === "embossed-hoodie-2-0" && (
        <SizeSelector
          sizes={["S", "M", "L", "XL"]}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onIncrease={() => setQuantity((q) => Math.min(q + 1, maxQuantity))}
        onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
        max={maxQuantity}
      />

      {/* Add to Cart Button */}
      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        selectedSize={selectedSize}
      />

    </div>
  );
}
