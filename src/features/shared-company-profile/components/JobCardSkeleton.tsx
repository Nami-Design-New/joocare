export default function JobCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="flex animate-pulse flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="h-[46px] w-[52px] rounded-xl bg-muted/60" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-3/4 rounded bg-muted/60" />
            <div className="h-4 w-1/2 rounded bg-muted/50" />
            <div className="h-3 w-1/3 rounded bg-muted/40" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-4 w-28 rounded bg-muted/50" />
          <div className="h-4 w-24 rounded bg-muted/50" />
          <div className="h-4 w-20 rounded bg-muted/50" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-28 rounded-full bg-muted/45" />
          <div className="h-7 w-24 rounded-full bg-muted/45" />
          <div className="h-7 w-20 rounded-full bg-muted/45" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-11/12 rounded bg-muted/40" />
          <div className="h-4 w-2/3 rounded bg-muted/40" />
        </div>

        <div className="mt-2 flex items-center justify-between border-t pt-4">
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded-full bg-muted/45" />
            <div className="h-9 w-24 rounded-full bg-muted/45" />
          </div>
          <div className="h-9 w-28 rounded-full bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
