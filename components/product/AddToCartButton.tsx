"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Product, ProductVariant } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  selectedSize?: string | null;
}

export default function AddToCartButton({
  product,
  selectedVariant,
  quantity,
  selectedSize,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      alert("Please select a color");
      return;
    }

    if (product.slug === "embossed-hoodie-2-0" && !selectedSize) {
      alert("Please select a size");
      return;
    }

    setIsAdding(true);

    // Generate unique cart item ID
    const cartItemId = `${product.id}-${selectedVariant?.value || "default"}-${
      selectedSize || "nosize"
    }`;

    addItem({
      id: cartItemId,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant?.name,
      size: selectedSize || undefined,
      price: Number(product.salePrice ?? product.price),
      quantity,
      image: product.images[0] || "",
    });

    // Small delay for better UX
    setTimeout(() => {
      setIsAdding(false);
      router.push("/cart");
    }, 300);
  };

  const isOutOfStock =
    (selectedVariant && selectedVariant.stockQty === 0) ||
    (!selectedVariant && product.stockQty === 0);

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      size="lg"
      className="w-full border-2 border-black"
    >
      {isAdding ? "ADDING..." : isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
    </Button>
  );
}
