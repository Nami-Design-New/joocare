import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type FeatureTaglineProps = {
  children: ReactNode;
  className?: string;
};

// Small sparkle pill above a feature headline ("Smart CV Builder", "AI-Driven CV Analysis").
export default function FeatureTagline({
  children,
  className,
}: FeatureTaglineProps) {
  return (
    <span
      className={cn(
        'flex w-fit items-center gap-2.5 rounded-xl border border-tagline-border bg-soft-overlay px-4 py-2 text-foreground',
        className,
      )}
    >
      <Image src="/assets/icons/sparkle.svg" alt="" width={16} height={16} />
      {children}
    </span>
  );
}
