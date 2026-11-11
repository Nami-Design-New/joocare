import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';

const addButtonVariants = cva(
  'flex shrink-0 cursor-pointer items-center justify-center gap-2 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        /** Green round "+" under the item cards (education, certificates). */
        round:
          'h-13 w-21 self-end rounded-full bg-cv-builder-primary text-primary-foreground hover:bg-cv-builder-primary/90',
        /** Dark round "+" next to an input (responsibilities, skills). */
        dark: 'size-13 rounded-full bg-secondary text-primary-foreground hover:bg-secondary/90',
        /** Green pill with a label (add experience). */
        pill: 'h-13 self-center rounded-full bg-cv-builder-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-cv-builder-primary/90 sm:px-10',
        /** Text link (add another publication / conference). */
        link: 'self-start text-sm font-semibold text-cv-builder-primary hover:underline',
        /** Dashed full-width row (add language). */
        dashed:
          'h-15 w-full rounded-full border border-dashed border-cv-builder-primary text-cv-builder-primary hover:bg-cv-builder-primary/5',
      },
    },
  },
);

type CvAddButtonProps = ComponentProps<'button'> &
  VariantProps<typeof addButtonVariants> & {
    /** Visible text; icon-only variants use it as the accessible name. */
    label: string;
  };

// "+" buttons that add a row or an item in the wizard.
export default function CvAddButton({
  variant,
  label,
  className,
  ...props
}: CvAddButtonProps) {
  const iconOnly =
    variant === 'round' || variant === 'dark' || variant === 'dashed';

  return (
    <button
      type="button"
      aria-label={iconOnly ? label : undefined}
      className={cn(addButtonVariants({ variant }), className)}
      {...props}
    >
      {variant === 'link' ? (
        `+ ${label}`
      ) : (
        <>
          <Plus aria-hidden className="size-6" strokeWidth={1.5} />
          {!iconOnly && label}
        </>
      )}
    </button>
  );
}
