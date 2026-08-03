import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Tag, User } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/queries/blogs";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string | Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = blog.category
    ? await getRelatedBlogs(blog.category, slug)
    : [];

  // Split content into paragraphs for rendering
  const contentParagraphs = blog.content
    .split(/\n\n+/)
    .filter((p) => p.trim());

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-deep">
        {blog.featuredImage ? (
          <>
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/40" />
          </>
        ) : (
          <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]" />
        )}

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Journal
          </Link>

          {/* Category Badge */}
          {blog.category && (
            <span className="mt-6 inline-block rounded-full bg-gold/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h1 className="mt-5 font-playfair text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/50">
            {blog.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {blog.author}
              </span>
            )}
            {blog.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(blog.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {blog.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </section>

      {/* Featured Image (full-width below hero) */}
      {blog.featuredImage && (
        <div className="relative mx-auto -mt-1 aspect-[21/9] max-w-5xl overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="relative h-full overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px_rgba(11,27,51,0.3)]">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="prose prose-lg max-w-none">
            {contentParagraphs.map((paragraph, index) => {
              // Check if it looks like a heading (starts with # or is all caps short text)
              if (paragraph.startsWith("# ")) {
                return (
                  <h2
                    key={index}
                    className="mt-10 font-playfair text-2xl font-medium text-navy sm:text-3xl"
                  >
                    {paragraph.replace(/^#+\s/, "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h3
                    key={index}
                    className="mt-8 font-playfair text-xl font-medium text-navy sm:text-2xl"
                  >
                    {paragraph.replace(/^#+\s/, "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h4
                    key={index}
                    className="mt-6 font-playfair text-lg font-medium text-navy"
                  >
                    {paragraph.replace(/^#+\s/, "")}
                  </h4>
                );
              }
              return (
                <p
                  key={index}
                  className="mt-5 text-[15px] leading-[1.85] text-muted-foreground first:mt-0"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </Reveal>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-12 border-t border-champagne-deep pt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gold-dark" strokeWidth={1.6} />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-champagne-deep bg-champagne/30 px-3 py-1 text-xs font-medium text-navy"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </article>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-champagne-deep bg-champagne/20 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
                  Keep reading
                </p>
                <h2 className="mt-4 font-playfair text-3xl font-medium text-navy sm:text-4xl">
                  Related{" "}
                  <span className="text-gradient-gold italic">articles</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((related, index) => (
                <Reveal key={related.slug} delay={index * 0.1}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-champagne-deep bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(11,27,51,0.2)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-champagne/50">
                          <span className="font-playfair text-4xl text-gold/30">
                            Z
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-playfair text-lg font-medium leading-snug text-navy transition-colors group-hover:text-gold-dark">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {related.excerpt}
                        </p>
                      )}
                      <span className="mt-4 text-xs text-muted-foreground">
                        {formatDate(related.publishedAt)}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog CTA */}
      <section className="bg-background py-12">
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold-dark transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </section>
    </>
  );
}
