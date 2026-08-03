"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filters,
  type ActiveFilters,
} from "@/components/product/filters";
import type { CategoryWithCount } from "@/types/product";

interface FiltersSheetProps {
  categories: CategoryWithCount[];
  active: ActiveFilters;
  totalProducts: number;
}

export function FiltersSheet({
  categories,
  active,
  totalProducts,
}: FiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className="h-11 border-champagne-deep bg-white px-4 text-sm tracking-[0.15em] text-navy uppercase hover:border-gold hover:text-gold-dark"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        }
      />
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto bg-background">
        <SheetTitle className="sr-only">Filters</SheetTitle>
        <div className="border-b border-champagne-deep px-6 pt-5 pb-4">
          <p className="font-playfair text-2xl text-navy">
            Refine <span className="text-gold-dark italic">the search</span>
          </p>
        </div>
        <div className="px-6 py-6">
          <Filters
            categories={categories}
            active={active}
            totalProducts={totalProducts}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
