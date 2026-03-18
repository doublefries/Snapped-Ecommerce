"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium uppercase">SIZE</label>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-4 py-2 border-2 uppercase text-sm font-medium transition-colors ${
              selectedSize === size
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-100"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

