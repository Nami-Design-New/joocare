import type { ReactNode } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

type StepSectionCardProps = {
  value: string;
  title: string;
  children: ReactNode;
  // Template / custom question cards have a grey body.
  mutedBody?: boolean;
  className?: string;
};

// Collapsible white card with a 21px title and a round chevron (post-job step 2).
export default function StepSectionCard({
  value,
  title,
  children,
  mutedBody = false,
  className,
}: StepSectionCardProps) {
  return (
    <AccordionItem
      value={value}
      className={cn('bg-card border-border overflow-hidden rounded-2xl border last:border-b', className)}
    >
      <AccordionTrigger
        iconType="circle-arrow"
        className="text-secondary items-center px-3 py-4 text-start text-xl font-semibold hover:no-underline sm:text-[21px]"
      >
        {title}
      </AccordionTrigger>
      <AccordionContent className={cn('p-3', mutedBody && 'bg-muted')}>{children}</AccordionContent>
    </AccordionItem>
  );
}
