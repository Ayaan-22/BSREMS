import { cn } from "../../lib/utils";

export function Skeleton({ className = "h-24" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-gradient-to-r from-white/[.04] via-white/[.08] to-white/[.04]", className)} />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
