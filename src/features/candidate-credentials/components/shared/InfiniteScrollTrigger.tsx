"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { CredentialCardSkeleton } from "./CredentialCardSkeleton";

type InfiniteScrollTriggerProps = {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
};

export default function InfiniteScrollTrigger({
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useEffectEvent(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    onLoadMore();
  });

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          handleIntersect();
        }
      },
      {
        rootMargin: "160px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage]);

  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }

  return (
    <div className="pt-2">
      {isFetchingNextPage ? <CredentialCardSkeleton /> : null}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
    </div>
  );
}
