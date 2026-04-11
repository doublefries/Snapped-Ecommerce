import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Snapped - Premium apparel and accessories",
};

function heroImageSrc(): string {
  const explicit = process.env.NEXT_PUBLIC_HERO_IMAGE?.trim();
  if (explicit) return explicit;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/product-images/tees/tee-cover-sunrise.png`;
  }

  return "https://via.placeholder.com/1200x900/e5e7eb/6b7280?text=Snapped";
}

export default function Home() {
  const heroSrc = heroImageSrc();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-full mb-8 border border-black">
          <div className="relative w-full aspect-[4/3] max-h-[60vh] overflow-hidden bg-gray-100">
            <Image
              src={heroSrc}
              alt="Snapped Washed Tees in Sunset"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 42rem"
            />
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
