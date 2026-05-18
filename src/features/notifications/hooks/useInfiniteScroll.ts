"use client";

import { useCallback, useEffect, useRef } from "react";

type InfiniteScrollOptions = {
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
};

export function useInfiniteScroll({
  enabled,
  onLoadMore,
  rootMargin = "200px 0px",
  threshold = 0,
}: InfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rootElementRef = useRef<Element | null>(null);
  const targetElementRef = useRef<Element | null>(null);

  const enabledRef = useRef(enabled);
  const onLoadMoreRef = useRef(onLoadMore);
  const optionsRef = useRef({ rootMargin, threshold });

  enabledRef.current = enabled;
  onLoadMoreRef.current = onLoadMore;
  optionsRef.current = { rootMargin, threshold };

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const connect = useCallback(() => {
    disconnect();

    if (!enabledRef.current) {
      return;
    }

    const target = targetElementRef.current;
    if (!target) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (!enabledRef.current) return;
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      {
        root: rootElementRef.current,
        rootMargin: optionsRef.current.rootMargin,
        threshold: optionsRef.current.threshold,
      },
    );

    observerRef.current.observe(target);
  }, [disconnect]);

  const setRootRef = useCallback(
    (node: Element | null) => {
      if (rootElementRef.current === node) return;
      rootElementRef.current = node;
      connect();
    },
    [connect],
  );

  const setTargetRef = useCallback(
    (node: Element | null) => {
      if (targetElementRef.current === node) return;
      targetElementRef.current = node;
      connect();
    },
    [connect],
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    setRootRef,
    setTargetRef,
  };
}
