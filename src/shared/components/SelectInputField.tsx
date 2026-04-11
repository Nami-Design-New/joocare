"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./ui/combobox";
import { Button } from "./ui/button";

export type Option = {
  label: string;
  value: string;
  image?: string;
  disabled?: boolean;
};

type SelectInputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showPlaceholderImage?: string;
  disabled?: boolean;

  // pagination
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;

  withSearchInput?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  portalContainer?: HTMLElement | null;
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
      disabled = false,
      onReachEnd,
      hasNextPage,
      isFetchingNextPage,
      withSearchInput = false,
      searchPlaceholder = "Search...",
      onSearchChange,
      portalContainer,
      ...props
    },
    ref,
  ) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const observerRef = React.useRef<IntersectionObserver | null>(null);

    //  stable callback
    const handleObserver = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (isFetchingNextPage) return;

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              onReachEnd?.();
            }
          },
          {
            root: listRef.current,
            rootMargin: "100px", // preload before reaching bottom
          },
        );

        if (node) observerRef.current.observe(node);
      },
      [hasNextPage, isFetchingNextPage, onReachEnd],
    );

    const selectedOption = options?.find((o) => o.value === value);

    return (
      <div className={cn("flex w-full flex-col", containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}
          </label>
        )}

        <Combobox
          id={id}
          items={options}
          value={selectedOption ?? null}
          onValueChange={(option) =>
            onChange?.((option as Option)?.value ?? "")
          }
          disabled={disabled}
        >
          <ComboboxTrigger
            ref={ref}
            {...props}
            render={
              <Button
                className={cn(
                  "bg-muted border-input h-13 w-full justify-between rounded-full px-4 text-sm font-normal",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:bg-disabled text-foreground",
                  error && "border-destructive",
                  className,
                )}
                aria-invalid={!!error}
              />
            }
          >
            {selectedOption ? (
              <>
                {showPlaceholderImage && selectedOption.image && (
                  <Image
                    src={selectedOption.image}
                    alt={selectedOption.label}
                    width={30}
                    height={15}
                  />
                )}
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground flex gap-1">
                {showPlaceholderImage && (
                  <Image
                    src={showPlaceholderImage}
                    alt="placeholder"
                    width={30}
                    height={15}
                  />
                )}
                {placeholder || "Select an option"}
              </span>
            )}
          </ComboboxTrigger>

          <ComboboxContent portalContainer={portalContainer}>
            {withSearchInput && (
              <ComboboxInput
                showTrigger={false}
                placeholder={searchPlaceholder}
                onChange={(event) => onSearchChange?.(event.currentTarget.value)}
              />
            )}

            <ComboboxEmpty>No results found.</ComboboxEmpty>

            <ComboboxList
              ref={listRef}
              className="max-h-60 overflow-y-auto"
            >
              {(item: Option) => (
                <>
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

                  {/* ❗ مهم: sentinel يكون مرتبط بآخر item */}
                  {item === options[options.length - 1] && (
                    <div ref={handleObserver} className="h-1" />
                  )}
                </>
              )}
            </ComboboxList>
            {isFetchingNextPage && (
              <div className="text-muted-foreground px-2 pb-2 text-center text-xs">
                Loading...
              </div>
            )}
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