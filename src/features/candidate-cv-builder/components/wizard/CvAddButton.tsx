import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';

const addButtonVariants = cva(
  'flex shrink-0 cursor-pointer items-center justify-center gap-2 transition-colors focus-visible:ring-ring/50 outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        /** Green round "+" under the item cards (education, certificates). */
        round:
          'bg-cv-builder-primary hover:bg-cv-builder-primary/90 text-primary-foreground h-13 w-21 self-end rounded-full',
        /** Dark round "+" next to an input (responsibilities, skills). */
        dark: 'bg-secondary hover:bg-secondary/90 text-primary-foreground size-13 rounded-full',
        /** Green pill with a label (add experience). */
        pill: 'bg-cv-builder-primary hover:bg-cv-builder-primary/90 text-primary-foreground h-13 self-center rounded-full px-6 text-sm sm:px-10 font-semibold',
        /** Text link (add another publication / conference). */
        link: 'text-cv-builder-primary self-start text-sm font-semibold hover:underline',
        /** Dashed full-width row (add language). */
        dashed:
          'border-cv-builder-primary text-cv-builder-primary hover:bg-cv-builder-primary/5 h-15 w-full rounded-full border border-dashed',
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
