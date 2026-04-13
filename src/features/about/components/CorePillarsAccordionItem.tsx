import { ChevronDown, ChevronUp } from "lucide-react";
import type { AboutPillar } from "../types/about.types";

type CorePillarsAccordionItemProps = {
  pillar: AboutPillar;
  isOpen: boolean;
  onToggle: () => void;
};

export default function CorePillarsAccordionItem({
  pillar,
  isOpen,
  onToggle,
}: CorePillarsAccordionItemProps) {
  return (
    <div className="border-border border-b pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-1 text-left"
      >
        <span className={`text-primary text-base font-semibold sm:text-lg`}>
          {pillar.title}
        </span>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <p className="text-muted-foreground mt-4 max-w-xl text-justify text-sm sm:text-base">
          {pillar.content}
        </p>
      )}
    </div>
  );
}
