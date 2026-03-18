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
  const colors = Array.from(
    new Map(
      variants
        .filter((v) => v.colorValue !== "default")
        .map((v) => [v.colorValue, { value: v.colorValue, name: v.colorName }])
    ).values()
  );

  if (colors.length <= 1) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium uppercase">COLOR</label>
      <div className="flex gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onSelect(color.value)}
            className={`px-4 py-2 border-2 uppercase text-sm font-medium transition-colors ${
              selectedValue === color.value
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-100"
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
