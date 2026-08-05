import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogs } from "@/lib/queries/blogs";

function formatDate(value: Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function BlogPreview() {
  const { blogs } = await getBlogs({ limit: 3 });

  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Heading row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
              The Journal
            </p>
            <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
              Our News &amp; Updates
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Styling stories, care guides and the stories behind the stones.
            </p>
          </div>
          <Link
            href="/blog"
            className="group hidden shrink-0 items-center gap-2 border-b border-gold/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-colors duration-300 hover:border-gold sm:inline-flex"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-champagne-deep to-transparent" />

        {blogs.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-parchment/50 px-6 py-16 text-center">
            <p className="font-playfair text-xl text-emerald-deep">
              Fresh stories are on the way
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our journal is being written — check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post, i) => (
              <article
                key={post.slug}
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-champagne-deep/60 bg-ivory shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(11,21,34,0.3)]"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-1 flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-brand via-[#0d2435] to-teal">
                        <span className="font-display text-5xl italic text-gold/60">
                          Z
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/10" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-gold-dark uppercase">
                      {post.category || "Journal"}
                      {formatDate(post.publishedAt) &&
                        ` · ${formatDate(post.publishedAt)}`}
                    </p>
                    <h3 className="mt-2.5 line-clamp-2 font-playfair text-lg font-semibold leading-snug text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-emerald-deep uppercase transition-colors duration-300 group-hover:text-gold-dark">
                      Read more
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
