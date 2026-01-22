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
}

export default function AddToCartButton({
  product,
  selectedVariant,
  quantity,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      alert("Please select a color");
      return;
    }

    setIsAdding(true);

    // Generate unique cart item ID
    const cartItemId = `${product.id}-${selectedVariant?.value || "default"}`;

    addItem({
      id: cartItemId,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant?.name,
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
