"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./ui/combobox";
import { Button } from "./ui/button";
import { Option } from "./SelectInputField";

type MultiSelectInputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  options: Option[];
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  disabled?: boolean;
  hint?: string;
};

export const MultiSelectInputField = React.forwardRef<
  HTMLButtonElement,
  MultiSelectInputFieldProps
>(
  (
    {
      label,
      id,
      error,
      options,
      placeholder,
      value = [],
      onChange,
      className,
      containerStyles,
      disabled = false,
      hint,
      ...props
    },
    ref,
  ) => {
    const selectedOptions = options.filter((o) =>
      value.includes(o.value ?? ""),
    );

    console.log(props);

    console.log(selectedOptions);

    return (
      <div className={cn("flex w-full flex-col", containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}{" "}
            {hint && (
              <span className="text-muted-foreground mx-1 text-sm font-normal">
                {hint}
              </span>
            )}
          </label>
        )}

        <Combobox
          id={id}
          items={options}
          multiple
          value={selectedOptions}
          onValueChange={(raw) => {
            console.log(raw);

            const selected = (raw as Option[]).map((o) => o.value ?? "");
            onChange?.(selected);
          }}
          disabled={disabled}
        >
          <ComboboxTrigger
            ref={ref}
            {...props}
            render={
              <Button
                variant="outline"
                className={cn(
                  // ── identical base styles to SelectInputField ──
                  "bg-muted border-input h-13 w-full justify-between rounded-full px-4 text-sm font-normal",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:bg-disabled",
                  // expand height when chips wrap
                  selectedOptions.length > 0 && "h-auto min-h-13 py-2",
                  error && "border-destructive",
                  className,
                )}
                aria-invalid={!!error}
              />
            }
          >
            {selectedOptions.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                {selectedOptions.map((o) => (
                  <span
                    key={o.value}
                    className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    {o.label}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {placeholder || "Select options"}
              </span>
            )}
          </ComboboxTrigger>

          <ComboboxContent>
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={30}
                      height={15}
                    />
                  )}
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {error && (
          <span className="mt-1 text-[12px] text-red-500">{error}</span>
        )}
      </div>
    );
  },
);

MultiSelectInputField.displayName = "MultiSelectInputField";
