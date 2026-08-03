import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/zhanna-logo.png"
      alt="Zhanna — Artificial Diamond & Fashion Jewellery"
      width={1536}
      height={1024}
      priority={priority}
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}
