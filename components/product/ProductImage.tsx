"use client";

import Image from "next/image";
import { isNonOptimizableImageSrc } from "@/lib/utils";

interface ProductImageProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onSelectImageIndex: (index: number) => void;
}

export default function ProductImage({
  images,
  productName,
  selectedImageIndex,
  onSelectImageIndex,
}: ProductImageProps) {
  if (images.length === 0) {
    return (
      <div className="w-full aspect-square border border-black bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No Image Available</p>
      </div>
    );
  }

  const mainImageUrl = images[selectedImageIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square border border-black overflow-hidden bg-gray-100">
        <Image
          src={mainImageUrl}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={85}
          unoptimized={isNonOptimizableImageSrc(mainImageUrl)}
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImageIndex(index)}
              className={`relative w-16 h-16 border-2 flex-shrink-0 ${
                mainImageUrl === image ? "border-black" : "border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                quality={60}
                unoptimized={isNonOptimizableImageSrc(image)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
