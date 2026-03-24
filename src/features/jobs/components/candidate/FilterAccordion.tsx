// ─── Sub-components ──────────────────────────────────────────────────────────

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  section: AccordionSection;
  isOpen: boolean;
  selected: string[];
  onToggle: () => void;
  onCheck: (value: string, checked: boolean) => void;
}

export default function FilterAccordion({
  section,
  isOpen,
  selected,
  onToggle,
  onCheck,
}: AccordionProps) {
  return (
    <div className="border-border border-b last:border-none">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="hover:text-primary flex w-full items-center justify-between py-3.5 text-left transition-colors"
      >
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            isOpen ? "text-secondary" : "text-foreground/80",
          )}
        >
          {section.label}
        </span>
        {isOpen ? (
          <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
      </button>

      {/* Options */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 pb-4">
          {section.options.map((option) => {
            const id = `${section.key}-${option}`;
            const checked = selected.includes(option);
            return (
              <div key={option} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(value) => onCheck(option, !!value)}
                  className={cn(
                    "border-border h-5 w-5 rounded-[2px] bg-[#E5E7EB] outline-0",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:h-5 data-[state=checked]:w-5 data-[state=checked]:rounded-[2px]",
                  )}
                />
                <Label
                  htmlFor={id}
                  className="text-foreground/75 cursor-pointer text-sm font-normal select-none"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
