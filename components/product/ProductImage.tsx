"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  images: string[];
  productName: string;
}

export default function ProductImage({ images, productName }: ProductImageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square border border-black bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No Image Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square border border-black overflow-hidden bg-gray-100">
        <Image
          src={images[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-16 h-16 border-2 flex-shrink-0 ${
                selectedImageIndex === index
                  ? "border-black"
                  : "border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
