'use client';

import { Search } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Input } from './ui/input';

type SearchInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  containerClassName?: string;
  iconClassName?: string;
  icon?: ReactNode;
};

export default function SearchInput({
  className,
  containerClassName,
  iconClassName,
  icon,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', containerClassName)}>
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute start-4 top-1/2 z-10 -translate-y-1/2',
            iconClassName,
          )}
        >
          {icon}
        </span>
      ) : (
        <Search
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute start-4 top-1/2 z-10 size-5 -translate-y-1/2 text-primary',
            iconClassName,
          )}
        />
      )}
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn('h-13 border-0 bg-card ps-12 shadow-none', className)}
        {...props}
      />
    </div>
  );
}
