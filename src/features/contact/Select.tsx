"use client";

import { useMemo, useState } from "react";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type OptionType = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  options?: OptionType[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const DEFAULT_OPTIONS: OptionType[] = [
  { value: "type", label: "ex:Type of inquiry" },
  { value: "technical", label: "Technical support" },
  { value: "sales", label: "Sales inquiry" },
  { value: "general", label: "General inquiry" },
];

export function Select({
  label,
  options = DEFAULT_OPTIONS,
  placeholder,
  value,
  onChange,
}: SelectProps) {
  const firstValue = useMemo(() => options[0]?.value ?? "", [options]);
  const [internalValue, setInternalValue] = useState<string>(
    value ?? firstValue,
  );

  const selectedValue = value ?? internalValue;

  return (
    <div>
      {label && (
        <label className="text-foreground mb-2 block text-sm font-semibold">
          {label}
        </label>
      )}
      <UiSelect
        value={selectedValue}
        onValueChange={(nextValue) => {
          if (value === undefined) {
            setInternalValue(nextValue);
          }
          onChange?.(nextValue);
        }}
      >
        <SelectTrigger className="border-border bg-muted w-full text-sm">
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
        <SelectContent className="border-border bg-card rounded-xl">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </UiSelect>
    </div>
  );
}
