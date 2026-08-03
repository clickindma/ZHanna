import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1.5 text-xs", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (item.href && !isLast) {
          return (
            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <Link
                href={item.href}
                className="text-muted-foreground tracking-[0.12em] uppercase transition-colors hover:text-gold-dark"
              >
                {item.label}
              </Link>
              <ChevronRight className="h-3 w-3 text-champagne-deep" />
            </span>
          );
        }

        return (
          <span
            key={`${item.label}-${index}`}
            className={cn(
              "flex items-center gap-1.5 tracking-[0.12em] uppercase",
              isLast ? "text-gold-dark" : "text-muted-foreground"
            )}
            aria-current={isLast ? "page" : undefined}
          >
            {item.label}
          </span>
        );
      })}
    </nav>
  );
}
