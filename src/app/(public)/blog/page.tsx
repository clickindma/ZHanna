import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Search as SearchIcon } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { Reveal } from "@/components/shared/reveal";
import { getBlogs, getBlogCategories } from "@/lib/queries/blogs";
import { BlogSearch } from "@/components/blog/blog-search";

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

function formatDate(date: string | Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category || "";
  const search = params.search || "";

  const [{ blogs, totalPages }, categories] = await Promise.all([
    getBlogs({ page, limit: 12, category, search }),
    getBlogCategories(),
  ]);

  const featured = page === 1 && !search && !category ? blogs[0] : null;
  const gridBlogs = featured ? blogs.slice(1) : blogs;

  return (
    <>
      <PublicPageHeader
        eyebrow="Journal"
        title={
          <>
            Stories of{" "}
            <span className="text-gradient-gold italic">craft & beauty</span>
          </>
        }
        description="Discover styling tips, behind-the-scenes craftsmanship, and inspiration from the world of fine jewellery."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      {/* Filter Bar */}
      <section className="border-b border-champagne-deep bg-background">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                  !category
                    ? "bg-navy-deep text-white"
                    : "border border-champagne-deep text-navy hover:border-gold/40 hover:text-gold-dark"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                    category === cat
                      ? "bg-navy-deep text-white"
                      : "border border-champagne-deep text-navy hover:border-gold/40 hover:text-gold-dark"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Search */}
            <BlogSearch defaultValue={search} />
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchIcon className="h-12 w-12 text-champagne-deep" strokeWidth={1.2} />
              <h3 className="mt-5 font-playfair text-2xl text-navy">
                No posts found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "No blog posts published yet. Check back soon!"}
              </p>
              {(search || category) && (
                <Link
                  href="/blog"
                  className="mt-6 text-sm font-medium text-gold-dark transition-colors hover:text-gold"
                >
                  ← View all posts
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <Reveal>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group mb-14 block overflow-hidden rounded-2xl border border-champagne-deep bg-background transition-all duration-300 hover:shadow-[0_20px_60px_-20px_rgba(11,27,51,0.2)]"
                  >
                    <div className="grid lg:grid-cols-2">
                      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                        {featured.featuredImage ? (
                          <Image
                            src={featured.featuredImage}
                            alt={featured.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-champagne/50">
                            <span className="font-playfair text-6xl text-gold/30">Z</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        {featured.category && (
                          <span className="inline-block w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                            {featured.category}
                          </span>
                        )}
                        <h2 className="mt-4 font-playfair text-2xl font-medium leading-tight text-navy transition-colors group-hover:text-gold-dark sm:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
                          {featured.excerpt}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                          {featured.publishedAt && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(featured.publishedAt)}
                            </span>
                          )}
                          {featured.author && (
                            <span>by {featured.author}</span>
                          )}
                        </div>
                        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold-dark transition-colors group-hover:text-gold">
                          Read article
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Blog Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridBlogs.map((blog, index) => (
                  <Reveal key={blog.slug} delay={index * 0.05}>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-champagne-deep bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.2)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {blog.featuredImage ? (
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-champagne/50">
                            <span className="font-playfair text-4xl text-gold/30">Z</span>
                          </div>
                        )}
                        {blog.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-navy backdrop-blur-sm">
                            {blog.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-playfair text-lg font-medium leading-snug text-navy transition-colors group-hover:text-gold-dark">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between border-t border-champagne-deep pt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(blog.publishedAt)}
                          </span>
                          {blog.author && <span>{blog.author}</span>}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                      className="rounded-full border border-champagne-deep px-5 py-2 text-sm font-medium text-navy transition-colors hover:border-gold/40 hover:text-gold-dark"
                    >
                      ← Previous
                    </Link>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .map((p, idx, arr) => (
                        <span key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-muted-foreground">…</span>
                          )}
                          <Link
                            href={`/blog?page=${p}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                              p === page
                                ? "bg-navy-deep text-white"
                                : "text-navy hover:bg-champagne hover:text-gold-dark"
                            }`}
                          >
                            {p}
                          </Link>
                        </span>
                      ))}
                  </div>
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                      className="rounded-full border border-champagne-deep px-5 py-2 text-sm font-medium text-navy transition-colors hover:border-gold/40 hover:text-gold-dark"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
