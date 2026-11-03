'use client';

import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/utils';
import { Input } from './ui/input';

type SearchInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  containerClassName?: string;
  iconClassName?: string;
};

export default function SearchInput({
  className,
  containerClassName,
  iconClassName,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', containerClassName)}>
      <Search
        aria-hidden="true"
        className={cn(
          'text-primary pointer-events-none absolute start-4 top-1/2 z-10 size-5 -translate-y-1/2',
          iconClassName,
        )}
      />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn('bg-card h-13 border-0 ps-12 shadow-none', className)}
        {...props}
      />
    </div>
  );
}
