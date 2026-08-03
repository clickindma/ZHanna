import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Skeleton className="h-3 w-72" />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="space-y-6">
          <div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-10 w-3/4" />
            <Skeleton className="mt-4 h-8 w-40" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-12 w-full max-w-lg rounded-lg" />
          <Skeleton className="h-12 w-full max-w-lg rounded-lg" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <Skeleton className="mx-auto h-3 w-32" />
        <Skeleton className="mx-auto mt-5 h-9 w-80 max-w-full" />
        <Skeleton className="mx-auto mt-8 h-4 w-full" />
        <Skeleton className="mx-auto mt-3 h-4 w-full" />
        <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
      </div>
    </div>
  );
}
