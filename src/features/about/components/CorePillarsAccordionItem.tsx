import { ChevronDown, ChevronUp } from 'lucide-react';
import type { AboutPillar } from '../types/about.types';

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
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-1 text-left"
      >
        <span className={`text-base font-semibold text-primary sm:text-lg`}>
          {pillar.title}
        </span>

        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <p className="mt-4 max-w-xl text-start text-sm text-muted-foreground sm:text-justify sm:text-base">
          {pillar.content}
        </p>
      )}
    </div>
  );
}
