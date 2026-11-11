'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from './ui/combobox';
import { Button } from './ui/button';

export type Option = {
  label: string;
  value: string;
  image?: string;
  disabled?: boolean;
};

type SelectInputFieldProps = {
  label?: string;
  hint?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  'aria-label'?: string;
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
  allowDeselect?: boolean;
};

export const SelectInputField = React.forwardRef<
  HTMLButtonElement,
  SelectInputFieldProps
>(
  (
    {
      label,
      hint,
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
      searchPlaceholder = '',
      onSearchChange,
      portalContainer,
      allowDeselect = false,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations();
    const resolvedSearchPlaceholder = searchPlaceholder || t('common.search');
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
            rootMargin: '100px', // preload before reaching bottom
          },
        );

        if (node) observerRef.current.observe(node);
      },
      [hasNextPage, isFetchingNextPage, onReachEnd],
    );

    const selectedOption = options?.find((o) => o.value === value);

    return (
      <div className={cn('flex w-full flex-col', containerStyles)}>
        {label && (
          <div className="mx-1 mb-1 flex items-baseline gap-2">
            <label htmlFor={id} className="font-semibold">
              {label}
            </label>
            {hint ? (
              <span className="text-xs text-muted-foreground">{hint}</span>
            ) : null}
          </div>
        )}

        <Combobox
          id={id}
          items={options}
          value={selectedOption ?? null}
          // Without a visible search input there is nothing for the user to
          // type, so the list must never be filtered down (it should behave
          // like a plain <select>). Base UI otherwise keeps an internal
          // query synced to the selected label, which can go stale after a
          // programmatic value change and silently drop items from the list.
          filter={withSearchInput ? undefined : null}
          onValueChange={(option) => {
            const nextValue = (option as Option | null)?.value ?? '';

            if (allowDeselect && nextValue === value) {
              onChange?.('');
              return;
            }

            onChange?.(nextValue);
          }}
          disabled={disabled}
        >
          <ComboboxTrigger
            ref={ref}
            {...props}
            render={
              <Button
                className={cn(
                  'h-13 w-full justify-between truncate rounded-full border-input bg-muted px-4 text-sm font-normal',
                  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  'text-foreground disabled:bg-disabled',
                  error && 'border-destructive',
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
              <span className="flex gap-1 text-xs text-muted-foreground md:text-sm">
                {showPlaceholderImage && (
                  <Image
                    src={showPlaceholderImage}
                    alt={t('common.placeholder-image-alt')}
                    width={30}
                    height={15}
                  />
                )}
                {placeholder || t('common.select-an-option')}
              </span>
            )}
          </ComboboxTrigger>

          <ComboboxContent portalContainer={portalContainer}>
            {withSearchInput && (
              <ComboboxInput
                showTrigger={false}
                placeholder={resolvedSearchPlaceholder}
                onChange={(event) =>
                  onSearchChange?.(event.currentTarget.value)
                }
              />
            )}

            <ComboboxEmpty>{t('common.no-results-found')}</ComboboxEmpty>

            <ComboboxList ref={listRef} className="max-h-60 overflow-y-auto">
              {(item: Option) => (
                <React.Fragment key={item.value}>
                  <ComboboxItem
                    key={item.value}
                    value={item}
                    className={cn(
                      value === item.value &&
                        'bg-accent text-accent-foreground',
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

                  {item === options[options.length - 1] && (
                    <div ref={handleObserver} className="h-1" />
                  )}
                </React.Fragment>
              )}
            </ComboboxList>
            {isFetchingNextPage && (
              <div className="px-2 pb-2 text-center text-xs text-muted-foreground">
                {t('common.loading')}
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

SelectInputField.displayName = 'SelectInputField';
