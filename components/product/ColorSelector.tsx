"use client";

import { ProductVariant } from "@/lib/types";

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export default function ColorSelector({
  variants,
  selectedValue,
  onSelect,
}: ColorSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium uppercase">COLOR</label>
      <div className="flex gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.value)}
            className={`px-4 py-2 border-2 uppercase text-sm font-medium transition-colors ${
              selectedValue === variant.value
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-100"
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
}
