import { ChevronDown, ChevronUp } from "lucide-react";
import type { Pillar } from "./core-pillars-data";

type CorePillarsAccordionItemProps = {
  pillar: Pillar;
  isOpen: boolean;
  onToggle: () => void;
};

export default function CorePillarsAccordionItem({
  pillar,
  isOpen,
  onToggle,
}: CorePillarsAccordionItemProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-1 text-left"
      >
        <span
          className={`text-base font-semibold sm:text-lg ${
            isOpen ? "text-green-700" : "text-gray-800"
          }`}
        >
          {pillar.title}
        </span>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <p className="mt-4 max-w-xl text-sm text-gray-600 sm:text-base">
          {pillar.content}
        </p>
      )}
    </div>
  );
}
