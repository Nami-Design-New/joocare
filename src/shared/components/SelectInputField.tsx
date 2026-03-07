"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  // ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  // ComboboxValue,
} from "./ui/combobox";
import { Button } from "./ui/button";

type Option = {
  label: string;
  value: string | null;
  image?: string;
};

type SelectInputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  options: Option[];
  placeholder?: string;
  value?: Option | null;
  onChange?: (value: Option) => void;
  className?: string;
  showPlaceholderImage?: string;
};

export const SelectInputField = React.forwardRef<
  HTMLButtonElement,
  SelectInputFieldProps
>(
  (
    {
      label,
      id,
      error,
      options,
      placeholder,
      value,
      onChange,
      className,
      showPlaceholderImage,
      containerStyles,
    },
    ref,
  ) => {
    return (
      <div className={cn("flex w-full flex-col", className)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}
          </label>
        )}

        <Combobox
          id={id}
          items={options}
          value={value}
          onValueChange={(value) => onChange?.(value as Option)}
        >
          <ComboboxTrigger
            ref={ref}
            render={
              <Button
                variant="outline"
                className={cn(
                  "bg-muted border-input h-13 w-full justify-between rounded-full px-4 text-sm font-normal",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  error && "border-destructive",
                  className,
                )}
                aria-invalid={!!error}
              ></Button>
            }
          >
            {value ? (
              <>
                {showPlaceholderImage && value.image && (
                  <Image
                    src={value.image}
                    alt={value.label}
                    width={30}
                    height={15}
                  />
                )}
                <span>{value.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground flex gap-1">
                {showPlaceholderImage && (
                  <Image
                    src={showPlaceholderImage}
                    alt="flag assets"
                    width={30}
                    height={15}
                  />
                )}
                {placeholder || "Select an option"}
              </span>
            )}{" "}
          </ComboboxTrigger>

          <ComboboxContent>
            {/* <ComboboxInput
              showTrigger={false}
              placeholder="Search..."
            /> */}

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

SelectInputField.displayName = "SelectInputField";
