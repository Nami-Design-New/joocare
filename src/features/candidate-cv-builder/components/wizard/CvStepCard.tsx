import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { FieldSurfaceProvider } from '../fields/field-surface';

type CvStepCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

// Gray card of a wizard step: title, description and the step fields.
export default function CvStepCard({
  title,
  description,
  children,
  className,
}: CvStepCardProps) {
  return (
    <section
      className={cn('flex flex-col gap-5 rounded-xl bg-muted p-3', className)}
    >
      <header className="flex flex-col gap-1 p-2">
        <h2 className="text-[21px] leading-6.5 font-semibold text-secondary">
          {title}
        </h2>
        <p className="text-base leading-5 text-foreground/45">{description}</p>
      </header>
      <FieldSurfaceProvider surface="muted">{children}</FieldSurfaceProvider>
    </section>
  );
}
