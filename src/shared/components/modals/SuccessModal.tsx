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
import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import animationData from '../../../../public/assets/lottie/successfully.json';

type SuccessModalAction = {
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  closeOnClick?: boolean;
  variant?: 'default' | 'outline' | 'link';
};

type SuccessModalCallout = {
  title: string;
  description: string;
};

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  variant?: 'default' | 'submitted';
  visual?: ReactNode;
  visualClassName?: string;
  visualWrapperClassName?: string;
  callout?: SuccessModalCallout;
  primaryAction?: SuccessModalAction;
  secondaryAction?: SuccessModalAction;
  className?: string;
  actionsClassName?: string;
  children?: ReactNode;
  /** Closes the modal by itself after this many ms; `false` keeps it open until closed. */
  autoCloseMs?: number | false;
};

const DEFAULT_AUTO_CLOSE_MS = 3000;

export default function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  visual,
  visualClassName,
  visualWrapperClassName,
  callout,
  primaryAction,
  secondaryAction,
  className,
  actionsClassName,
  children,
  autoCloseMs = DEFAULT_AUTO_CLOSE_MS,
}: ConfirmDialogProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isSubmittedVariant = variant === 'submitted';
  // Latest handler, so a re-render while open doesn't restart the timer.
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || autoCloseMs === false) return;
    const timer = setTimeout(() => onOpenChangeRef.current(false), autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, autoCloseMs]);

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
          className="h-11 flex-1 gap-2"
        >
          <Link href={action.href} onClick={() => onOpenChange(false)}>
            {action.label}
            {action.icon}
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
          'h-11 flex-1 gap-2',
          action.variant === 'link' && 'h-auto min-h-8 p-0 underline',
        )}
        onClick={() => {
          action.onClick?.();
          if (action.closeOnClick !== false) onOpenChange(false);
        }}
      >
        {action.label}
        {action.icon}
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isSubmittedVariant}
        className={cn('max-w-150 rounded-2xl p-8 text-center', className)}
      >
        <div
          className={cn(
            'mt-15 mb-12 flex w-full items-center justify-center',
            visualWrapperClassName,
          )}
        >
          <div className={cn('h-50 w-50', visualClassName)}>
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
        {callout ? (
          <div className="bg-primary/10 mt-6 rounded-2xl p-4 text-start">
            <h3 className="text-foreground text-sm font-semibold">
              {callout.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {callout.description}
            </p>
          </div>
        ) : null}
        {children}
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
