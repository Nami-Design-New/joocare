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
          'gap-2.5 border-why-green-light/26 bg-why-green/6 px-3.5 py-2 text-xs tracking-[.2em] text-why-green-light',
        column:
          'h-[26px] gap-2 border-why-line bg-white/[.025] px-3 text-[10.5px] tracking-[.14em] text-why-ink-muted',
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
