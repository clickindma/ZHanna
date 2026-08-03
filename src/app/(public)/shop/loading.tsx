import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <>
      <section className="border-b border-champagne-deep bg-champagne/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="mt-6 h-12 w-72 max-w-full sm:h-14" />
          <Skeleton className="mt-5 h-4 w-full max-w-xl" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="space-y-8">
              <Skeleton className="h-11 w-full" />
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <Skeleton className="mb-8 h-4 w-44" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                  <Skeleton className="mt-4 h-3 w-20" />
                  <Skeleton className="mt-2 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
