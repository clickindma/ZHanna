"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";

interface BlogSearchProps {
  defaultValue?: string;
}

export function BlogSearch({ defaultValue = "" }: BlogSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      if (query.trim()) {
        router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/blog");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="h-9 w-full rounded-full border border-champagne-deep bg-background pl-9 pr-4 text-sm text-navy placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/20 sm:w-64"
      />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-gold-dark" />
      )}
    </form>
  );
}
