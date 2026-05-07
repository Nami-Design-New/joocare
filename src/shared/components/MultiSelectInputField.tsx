"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import Image from "next/image";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
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
  preloadOptions?: Option[];
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
    const [searchQuery, setSearchQuery] = React.useState("");
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

    const cachedSelectedOptions = value
      .map((v) => optionsCache.get(v))
      .filter((o): o is Option => o !== undefined);

    // Merge cached selected options into the items list so the Combobox
    // never loses track of already-selected items when search filters change.
    const mergedItems = React.useMemo(() => {
      const currentValues = new Set(options.map((o) => o.value));
      const missingSelected = cachedSelectedOptions.filter(
        (o) => !currentValues.has(o.value),
      );
      // Keep the server-provided options ordering stable; append missing selected
      // items so they remain selectable/checked without being forced to the top.
      return [...options, ...missingSelected];
    }, [cachedSelectedOptions, options]);

    const selectedValuesSet = React.useMemo(() => new Set(value), [value]);

    // Items shown in the dropdown:
    // - follow current (server) `options` order
    // - filtered by the search input
    // - hide already-selected items (so they don't keep appearing in results)
    const displayItems = React.useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      const filtered = query
        ? options.filter((item) =>
          (item.label ?? "").toLowerCase().includes(query),
        )
        : options;

      return filtered.filter((item) => !selectedValuesSet.has(item.value));
    }, [options, searchQuery, selectedValuesSet]);

    const selectedOptions = React.useMemo(() => {
      const mergedMap = new Map(mergedItems.map((item) => [item.value, item]));
      return value
        .map((selectedValue) => mergedMap.get(selectedValue))
        .filter((option): option is Option => option !== undefined);
    }, [mergedItems, value]);

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
          // Keep selected items in the combobox collection so checked state
          // doesn't break when options are paginated/searched.
          items={mergedItems}
          multiple
          value={selectedOptions}
          isItemEqualToValue={(item, selectedItem) =>
            item?.value === selectedItem?.value
          }
          onValueChange={(raw) => {
            const selected = Array.from(
              new Set(
                (raw as Option[])
                  .map((o) => o.value)
                  .filter((v): v is string => Boolean(v)),
              ),
            );
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
                  selectedOptions.length > 0 && "h-auto min-h-13 py-2 rounded-4xl",
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
                onChange={(event) => {
                  const nextValue = event.currentTarget.value;
                  setSearchQuery(nextValue);
                  onSearchChange?.(nextValue);
                }}
              />
            )}
            <ComboboxList ref={listRef} className="max-h-60 overflow-y-auto">
              {displayItems.length === 0 ? (
                <div className="text-muted-foreground px-2 py-2 text-center text-sm">
                  No results found.
                </div>
              ) : (
                <ComboboxCollection>
                  {(item: Option, index: number) => (
                    <ComboboxItem key={item.value} value={item}
                      className={cn(
                        "flex items-center gap-2",
                        value.includes(item.value ?? "") && "bg-accent text-accent-foreground"
                      )}
                    >
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
              )}
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
