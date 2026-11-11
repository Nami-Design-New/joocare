import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center overflow-hidden border border-transparent font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        open: 'bg-accent text-primary [a&]:hover:bg-primary/90',
        closed: 'bg-[#0A346314] text-secondary [a&]:hover:bg-secondary/90',
        paused: 'bg-[#DC262614] text-destructive [a&]:hover:bg-destructive/90',
        draft: 'bg-[#D1D0D0] text-muted-foreground [a&]:hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },

      size: {
        sm: 'gap-1 px-2 py-0.5 text-xs [&>svg]:size-3',
        md: 'gap-1.5 px-3 py-1 text-sm [&>svg]:size-4',
        lg: 'gap-2 px-4 py-1.5 text-base [&>svg]:size-5',
        pill: 'gap-2 rounded-full px-4 py-1.5 text-base [&>svg]:size-5',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
