"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-black">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 box-border">
        <div className="flex items-center justify-start gap-4 sm:gap-6">
          {/* Logo - larger on mobile */}
          <Link href="/" className="flex items-center shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/logo-black.png"
              alt="Snapped Logo"
              width={210}
              height={60}
              className="h-16 md:h-12 w-auto object-contain"
              priority
            />
            <span className="sr-only">Snapped - Premium Apparel & Accessories</span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-3 sm:gap-5 md:gap-6 lg:gap-8 ml-6 whitespace-nowrap">
            <Link
              href="/"
              className="uppercase text-xs sm:text-sm font-medium hover:underline"
            >
              HOME
            </Link>
            <Link
              href="/shop"
              className="uppercase text-xs sm:text-sm font-medium hover:underline"
            >
              SHOP ALL
            </Link>
            <Link
              href="/contact"
              className="uppercase text-xs sm:text-sm font-medium hover:underline"
            >
              CONTACT
            </Link>
          </nav>

          {/* Cart Icon - brought slightly left, with padding to avoid cutoff */}
          <Link
            href="/cart"
            className="relative flex shrink-0 items-center justify-center ml-auto mr-3 sm:mr-6"
            aria-label="Shopping cart"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4">
            {/* Full-bleed divider line on mobile */}
            <div className="-mx-4 border-t border-black pt-4 pb-2 px-4">
              <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="uppercase text-sm font-medium hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                href="/shop"
                className="uppercase text-sm font-medium hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SHOP ALL
              </Link>
              <Link
                href="/contact"
                className="uppercase text-sm font-medium hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
