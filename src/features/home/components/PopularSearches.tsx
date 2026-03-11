import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import PopularSearchItem from "./PopularSearchItem";

export default function PopularSearches() {
  return (
    <section className="flex w-full flex-col items-start gap-2 md:flex-row">
      <h4 className="text-foreground text-xl font-semibold whitespace-nowrap">
        Popular Searches
      </h4>
      <ul className="flex grow flex-wrap gap-2">
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
        <li>
          <PopularSearchItem label="Plastic Surgeon" />
        </li>
      </ul>

      <Button
        variant="outline"
        size="pill"
        hoverStyle="slidehorizontalPrimary"
        className="text-muted-foreground text-md group flex items-center gap-2 border-none font-normal"
      >
        Show more
        <ArrowRight
          size={28}
          strokeWidth={1.5}
          className="border-muted-foreground text-muted-foreground size-7 -rotate-45 rounded-full border bg-white transition-transform group-hover:rotate-0"
        />
      </Button>
    </section>
  );
}
