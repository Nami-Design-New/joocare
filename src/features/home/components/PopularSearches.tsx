import { Button } from "@/shared/components/ui/button";
import {
  ArrowRight,
  CircleArrowDown,
  CircleArrowRight,
  MoveRight,
} from "lucide-react";
import PopularSearchItem from "./PopularSearchItem";

export default function PopularSearches() {
  return (
    <section className="flex items-start gap-2 w-full">
      <h4 className="whitespace-nowrap text-xl font-semibold  text-foreground">
        Popular Searches
      </h4>
      <ul className="flex flex-wrap  gap-2 grow">
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
        className="text-muted-foreground font-normal text-md flex items-center gap-2 border-none  group"
      >
        Show more
        <ArrowRight
          size={28}
          strokeWidth={1.5}
          className="size-7  border-muted-foreground border rounded-full  transition-transform -rotate-45 group-hover:rotate-0 bg-white text-muted-foreground"
        />
      </Button>
    </section>
  );
}
