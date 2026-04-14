"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll(
    callback: () => void,
    hasMore: boolean
) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                callback();
            }
        });

        const el = ref.current;

        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [callback, hasMore]);

    return ref;
}