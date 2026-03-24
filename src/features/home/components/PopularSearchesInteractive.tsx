"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PopularSearches, { type PopularSearchesItem } from "./PopularSearches";
import { useState } from "react";

interface Props {
  items: PopularSearchesItem[];
  variant: "hero" | "jobs";
  maxVisible?: number;
}

export default function PopularSearchesInteractive({
  items,
  variant,
  maxVisible,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (item: PopularSearchesItem) => {
    if (variant === "hero") {
      router.push(`/jobs?search=${encodeURIComponent(item.label)}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", item.label);
      router.replace(`/jobs?${params.toString()}`);
    }
  };

  return (
    <PopularSearches
      items={items}
      maxVisible={isExpanded ? undefined : maxVisible}
      onItemClick={handleItemClick}
      onShowMore={() => setIsExpanded(true)}
      onShowLess={() => setIsExpanded(false)}
      isExpanded={isExpanded}
    />
  );
}
