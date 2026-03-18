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
  const variants = product.variants;

  const colorOptions = Array.from(
    new Set(variants.map((v) => v.colorValue).filter((v) => v !== "default"))
  );
  const sizeOptionsAll = Array.from(
    new Set(variants.map((v) => v.sizeValue).filter((v) => v !== "os"))
  );

  const needsColor = colorOptions.length > 1;
  const needsSize = sizeOptionsAll.length > 1;

  const [selectedColorValue, setSelectedColorValue] = useState<string | null>(
    colorOptions.length > 0 ? colorOptions[0] : "default"
  );
  const [selectedSizeValue, setSelectedSizeValue] = useState<string | null>(
    needsSize ? null : "os"
  );
  const [quantity, setQuantity] = useState(1);

  // Keep compatibility with the previous controlled prop shape (selectedVariantValue),
  // but interpret it as a selected *color* value now.
  const effectiveColorValue =
    controlledVariant !== undefined ? controlledVariant : selectedColorValue;
  const setEffectiveColorValue = onSelectVariant ?? setSelectedColorValue;

  const variantsForSelectedColor = variants.filter(
    (v) => v.colorValue === (effectiveColorValue ?? "default")
  );
  const sizeOptionsForColor = Array.from(
    new Map(
      variantsForSelectedColor.map((v) => [
        v.sizeValue,
        { value: v.sizeValue, name: v.sizeName },
      ])
    ).values()
  ).filter((s) => s.value !== "os");

  const selectedVariant: ProductVariant | null =
    variants.find(
      (v) =>
        v.colorValue === (effectiveColorValue ?? "default") &&
        v.sizeValue === (selectedSizeValue ?? "os")
    ) ?? null;

  const maxQuantity = selectedVariant
    ? selectedVariant.stockQty
    : product.stockQty;

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selector */}
      {variants.length > 0 && (
        <ColorSelector
          variants={variants}
          selectedValue={effectiveColorValue}
          onSelect={(value) => {
            setEffectiveColorValue(value);
            if (needsSize) setSelectedSizeValue(null);
          }}
        />
      )}

      {/* Size Selector */}
      {needsSize && (
        <SizeSelector
          sizes={sizeOptionsForColor.map((s) => s.name)}
          selectedSize={
            selectedSizeValue
              ? variantsForSelectedColor.find((v) => v.sizeValue === selectedSizeValue)
                  ?.sizeName ?? null
              : null
          }
          onSelect={(sizeName) => {
            const match = variantsForSelectedColor.find((v) => v.sizeName === sizeName);
            setSelectedSizeValue(match?.sizeValue ?? null);
          }}
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
        needsColor={needsColor}
        needsSize={needsSize}
      />

    </div>
  );
}
