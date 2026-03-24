import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import PopularSearchItem from "./PopularSearchItem";

export interface PopularSearchesItem {
  id: string;
  label: string;
}

interface PopularSearchesProps {
  items: PopularSearchesItem[];
  title?: string;
  maxVisible?: number;
  onItemClick?: (item: PopularSearchesItem) => void;
  onShowMore?: () => void;
  onShowLess?: () => void;
  isExpanded?: boolean;
  showMoreLabel?: string;
  showLessLabel?: string;
}

export default function PopularSearches({
  items,
  title = "Popular Searches",
  maxVisible,
  onItemClick,
  onShowMore,
  onShowLess,
  isExpanded = false,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
}: PopularSearchesProps) {
  const visibleItems = maxVisible ? items.slice(0, maxVisible) : items;
  const hasHidden = maxVisible !== undefined && items.length > maxVisible;

  return (
    <section className="flex w-full flex-col items-start gap-2 md:flex-row">
      <h4 className="text-foreground text-xl font-semibold whitespace-nowrap">
        {title}
      </h4>

      <ul className="flex grow flex-wrap gap-2">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <PopularSearchItem
              label={item.label}
              onClick={() => onItemClick?.(item)}
            />
          </li>
        ))}
      </ul>

      {(hasHidden || isExpanded) && (
        <Button
          variant="outline"
          size="pill"
          hoverStyle="slidehorizontalPrimary"
          className="text-muted-foreground text-md group flex items-center gap-2 border-none font-normal"
          onClick={isExpanded ? onShowLess : onShowMore}
        >
          {isExpanded ? showLessLabel : showMoreLabel}
          <ArrowRight
            size={28}
            strokeWidth={1.5}
            className={`border-muted-foreground text-muted-foreground size-7 -rotate-45 rounded-full border bg-white transition-transform group-hover:rotate-0`}
          />
        </Button>
      )}
    </section>
  );
}
