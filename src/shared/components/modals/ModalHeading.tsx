import type { ReactNode } from 'react';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

type ModalHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function ModalHeading({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: ModalHeadingProps) {
  return (
    <DialogHeader className={className}>
      <DialogTitle
        className={cn(
          'text-2xl leading-[normal] font-semibold tracking-[-0.28px] text-secondary sm:text-[28px]',
          titleClassName,
        )}
      >
        {title}
      </DialogTitle>
      {description ? (
        <DialogDescription
          className={cn(
            'text-base leading-[normal] text-muted-foreground',
            descriptionClassName,
          )}
        >
          {description}
        </DialogDescription>
      ) : null}
    </DialogHeader>
  );
}
