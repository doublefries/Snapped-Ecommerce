"use client";

import { Minus, Plus } from "lucide-react";
import Button from "./Button";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max,
}: QuantitySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium uppercase">QUANTITY</label>
      <div className="flex items-center gap-4 border-2 border-black w-fit">
        <button
          onClick={onDecrease}
          disabled={quantity <= min}
          className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          disabled={max !== undefined && quantity >= max}
          className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
