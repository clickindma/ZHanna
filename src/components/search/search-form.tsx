"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  initialQuery?: string;
  className?: string;
}

export function SearchForm({ initialQuery = "", className }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.6}
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search rings, necklaces, oxidised silver…"
        aria-label="Search jewellery"
        type="search"
        className="h-13 w-full rounded-full border border-champagne-deep bg-white pl-11 pr-28 text-[15px] text-emerald-deep shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-dark to-gold px-5 py-2 text-xs font-semibold tracking-[0.15em] text-emerald-deep uppercase shadow-sm transition-all hover:shadow-md hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
}
