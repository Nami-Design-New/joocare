"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
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
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  withSearchInput?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  portalContainer?: HTMLElement | null;
  preloadOptions?: Option[]
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
      onReachEnd,
      hasNextPage,
      isFetchingNextPage,
      withSearchInput = false,
      searchPlaceholder = "Search...",
      onSearchChange,
      portalContainer,
      preloadOptions = [],
      ...props
    },
    ref,
  ) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const observerRef = React.useRef<IntersectionObserver | null>(null);
    // ✅ KEEP only this:
    const [optionsCache, setOptionsCache] = React.useState<Map<string, Option>>(
      () => {
        const map = new Map<string, Option>();
        // Seed with preloaded options on first mount
        preloadOptions?.forEach((o) => {
          if (o.value != null) map.set(o.value, o);
        });
        return map;
      },
    );

    React.useEffect(() => {
      setOptionsCache((prev) => {
        const next = new Map(prev);
        let changed = false;

        options.forEach((o) => {
          if (o.value != null && !next.has(o.value)) {
            next.set(o.value, o);
            changed = true;
          }
        });

        preloadOptions?.forEach((o) => {
          if (o.value != null && !next.has(o.value)) {
            next.set(o.value, o);
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    }, [options, preloadOptions]);

    const selectedOptions = value
      .map((v) => optionsCache.get(v))
      .filter((o): o is Option => o !== undefined);

    // Merge cached selected options into the items list so the Combobox
    // never loses track of already-selected items when search filters change.
    const mergedItems = React.useMemo(() => {
      const currentValues = new Set(options.map((o) => o.value));
      const missingSelected = selectedOptions.filter(
        (o) => !currentValues.has(o.value),
      );
      return [...missingSelected, ...options];
    }, [options, selectedOptions]);

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
            rootMargin: "100px",
          },
        );

        if (node) observerRef.current.observe(node);
      },
      [hasNextPage, isFetchingNextPage, onReachEnd],
    );


    // const selectedOptions = options.filter((o) =>
    //   value.includes(o.value ?? ""),
    // );

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
          items={mergedItems}
          multiple
          value={selectedOptions}
          onValueChange={(raw) => {
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

          <ComboboxContent portalContainer={portalContainer}>
            {withSearchInput && (
              <ComboboxInput
                showTrigger={false}
                placeholder={searchPlaceholder}
                onChange={(event) => onSearchChange?.(event.currentTarget.value)}
              />
            )}
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            <ComboboxList ref={listRef} className="max-h-60 overflow-y-auto">
              <ComboboxCollection>
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
              </ComboboxCollection>
              <div ref={handleObserver} className="h-1" />
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

MultiSelectInputField.displayName = "MultiSelectInputField";
