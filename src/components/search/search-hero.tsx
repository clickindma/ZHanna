"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchHeroProps {
  initialQuery?: string;
  className?: string;
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchHero({ initialQuery = "", className }: SearchHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);
  const isFirstRender = useRef(true);

  // Navigate on debounced query change (real-time search)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const q = debouncedQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    } else if (initialQuery) {
      router.push("/search", { scroll: false });
    }
  }, [debouncedQuery, router, initialQuery]);

  const clearSearch = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={onSubmit}
      className={cn("relative mx-auto max-w-2xl", className)}
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.6}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search rings, necklaces, oxidised silver…"
          aria-label="Search jewellery"
          type="search"
          autoFocus
          className="h-14 w-full rounded-2xl border border-champagne-deep bg-white pl-13 pr-32 text-[15px] text-emerald-deep shadow-md outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:shadow-lg sm:h-16 sm:text-base sm:pl-14 sm:pr-36"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-24 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-champagne hover:text-emerald-deep sm:right-28"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-gold-dark to-gold px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-emerald-deep uppercase shadow-sm transition-all hover:shadow-md hover:brightness-110 sm:px-6 sm:py-3 sm:text-sm"
        >
          Search
        </button>
      </div>

      {/* Subtle hint */}
      <p className="mt-3 text-[12px] text-muted-foreground/70">
        Search updates as you type — press Enter or tap Search to confirm
      </p>
    </motion.form>
  );
}
