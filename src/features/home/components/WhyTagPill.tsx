import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import type { HomeWhyTone } from '../types/home.types';
import WhyTagMark from './WhyTagMark';

const tagPillVariants = cva(
  'inline-flex items-center rounded-full border font-medium uppercase rtl:tracking-normal',
  {
    variants: {
      variant: {
        eyebrow:
          'border-why-green-light/26 bg-why-green/6 text-why-green-light gap-2.5 px-3.5 py-2 text-xs tracking-[.2em]',
        column:
          'border-why-line text-why-ink-muted h-[26px] gap-2 bg-white/[.025] px-3 text-[10.5px] tracking-[.14em]',
      },
    },
    defaultVariants: {
      variant: 'column',
    },
  },
);

type WhyTagPillProps = VariantProps<typeof tagPillVariants> & {
  tone: HomeWhyTone;
  children: ReactNode;
  className?: string;
};

export default function WhyTagPill({
  tone,
  variant,
  children,
  className,
}: WhyTagPillProps) {
  return (
    <span className={cn(tagPillVariants({ variant }), className)}>
      <WhyTagMark tone={tone} />
      {children}
    </span>
  );
}
