import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Snapped - Premium apparel and accessories",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="w-full mb-8 border border-black">
          <div className="relative w-full aspect-[4/3] bg-gray-100">
            {/* Placeholder for product image - replace with actual image */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <p className="text-lg">Product Image</p>
            </div>
            {/* Uncomment when you have the actual image:
            <Image
              src="/images/hero-hat.jpg"
              alt="Snapped Trucker Hat"
              fill
              className="object-cover"
              priority
            />
            */}
          </div>
        </div>

        {/* Shop Now Button */}
        <Link href="/shop">
          <Button size="lg" className="border-2 border-black px-12 py-4">
            SHOP NOW
          </Button>
        </Link>
      </div>
    </div>
  );
}
