'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import animationData from '../../../../public/assets/lottie/successfully.json';

type SuccessModalAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  closeOnClick?: boolean;
  variant?: 'default' | 'outline' | 'link';
};

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: 'default' | 'submitted';
  visual?: ReactNode;
  primaryAction?: SuccessModalAction;
  secondaryAction?: SuccessModalAction;
  className?: string;
  actionsClassName?: string;
};

export default function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  visual,
  primaryAction,
  secondaryAction,
  className,
  actionsClassName,
}: ConfirmDialogProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isSubmittedVariant = variant === 'submitted';

  const renderAction = (
    action: SuccessModalAction,
    buttonVariant: 'default' | 'outline' | 'link',
  ) => {
    if (action.href) {
      return (
        <Button
          asChild
          variant={action.variant ?? buttonVariant}
          size="pill"
          className="h-11 flex-1"
        >
          <Link href={action.href} onClick={() => onOpenChange(false)}>
            {action.label}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant={action.variant ?? buttonVariant}
        size="pill"
        className={cn(
          'h-11 flex-1',
          action.variant === 'link' && 'h-auto min-h-8 p-0 underline',
        )}
        onClick={() => {
          action.onClick?.();
          if (action.closeOnClick !== false) onOpenChange(false);
        }}
      >
        {action.label}
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isSubmittedVariant}
        className={cn('max-w-150 rounded-2xl p-8 text-center', className)}
      >
        <div className="mt-15 mb-12 flex w-full items-center justify-center">
          <div className="h-50 w-50">
            {visual ?? (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                height={200}
                width={200}
                autoplay={true}
                loop={true}
              />
            )}
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-foreground text-center text-3xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-foreground mt-2 text-center text-lg leading-tight">
            {description}
          </DialogDescription>
        </DialogHeader>{' '}
        {primaryAction || secondaryAction ? (
          <div
            className={cn(
              'mt-8 flex flex-col gap-3 sm:flex-row',
              actionsClassName,
            )}
          >
            {primaryAction ? renderAction(primaryAction, 'default') : null}
            {secondaryAction ? renderAction(secondaryAction, 'outline') : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
