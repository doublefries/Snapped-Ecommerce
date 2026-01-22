"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="border-b border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">Snapped</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="uppercase text-sm font-medium hover:underline"
            >
              HOME
            </Link>
            <Link
              href="/shop"
              className="uppercase text-sm font-medium hover:underline"
            >
              SHOP ALL
            </Link>
            <Link
              href="/contact"
              className="uppercase text-sm font-medium hover:underline"
            >
              CONTACT
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-center gap-6 mt-4">
          <Link
            href="/"
            className="uppercase text-sm font-medium hover:underline"
          >
            HOME
          </Link>
          <Link
            href="/shop"
            className="uppercase text-sm font-medium hover:underline"
          >
            SHOP ALL
          </Link>
          <Link
            href="/contact"
            className="uppercase text-sm font-medium hover:underline"
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
