'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { LoaderCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

export type IllustratedModalAction = {
  label: string;
  variant?: 'default' | 'outline';
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

type IllustratedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  title: string;
  subtitle?: string;
  description?: ReactNode;
  // Small label above the title (e.g. "COMING SOON").
  badge?: ReactNode;
  // Panels / callouts between the text and the buttons.
  children?: ReactNode;
  actions: IllustratedModalAction[];
  // Small note under the buttons.
  footnote?: ReactNode;
  // Overrides what the X does (default: close).
  onCloseClick?: () => void;
  isBusy?: boolean;
  closePosition?: 'start' | 'end';
};

// Confirmation / result modal from the Figma job flow: 700px, illustration, title, text, actions.
export default function IllustratedModal({
  open,
  onOpenChange,
  imageSrc,
  title,
  subtitle,
  description,
  badge,
  children,
  actions,
  footnote,
  onCloseClick,
  isBusy = false,
  closePosition = 'end',
}: IllustratedModalProps) {
  const t = useTranslations('common');
  const close = () => {
    if (isBusy) return;
    if (onCloseClick) onCloseClick();
    else onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex w-[calc(100%-2rem)] max-w-175 flex-col items-center gap-5 rounded-3xl border-0 bg-card px-6 pt-10 pb-9 text-center shadow-xl sm:min-w-0 sm:px-10"
      >
        <button
          type="button"
          onClick={close}
          disabled={isBusy}
          aria-label={t('close')}
          className={cn(
            'absolute top-6 flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80',
            closePosition === 'end' ? 'end-6' : 'start-6',
          )}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <Image
          src={imageSrc}
          alt=""
          width={230}
          height={230}
          className="h-auto max-h-60 w-57.5 object-contain"
        />
        {badge}
        <div className="flex w-full flex-col gap-2.5">
          <DialogTitle className="text-2xl font-bold text-secondary sm:text-3xl">
            {title}
          </DialogTitle>
          {subtitle ? (
            <p className="text-lg font-medium text-foreground/80">{subtitle}</p>
          ) : null}
          {description ? (
            <DialogDescription className="text-base leading-relaxed whitespace-pre-line text-muted-foreground sm:text-[17px]">
              {description}
            </DialogDescription>
          ) : null}
        </div>
        {children ? <div className="w-full">{children}</div> : null}
        <div
          className={cn(
            'flex w-full flex-col gap-4 pt-2 sm:flex-row',
            actions.length === 1 && 'sm:justify-center',
          )}
        >
          {actions.map((action) => (
            <ModalActionButton
              key={action.label}
              action={action}
              single={actions.length === 1}
            />
          ))}
        </div>
        {footnote ? (
          <p className="-mt-1 text-sm text-muted-foreground">{footnote}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ModalActionButton({
  action,
  single,
}: {
  action: IllustratedModalAction;
  single: boolean;
}) {
  const { label, icon, iconPosition = 'end', isLoading = false } = action;
  const content = (
    <>
      {isLoading ? (
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
      ) : iconPosition === 'start' ? (
        icon
      ) : null}
      {label}
      {!isLoading && iconPosition === 'end' ? icon : null}
    </>
  );
  const className = cn(
    'h-13 gap-2.5 rounded-full text-base font-semibold',
    single ? 'w-full sm:w-75' : 'flex-1',
    action.variant === 'outline' && 'border-input bg-card',
    action.className,
  );

  if (action.href) {
    return (
      <Button
        asChild
        variant={action.variant ?? 'default'}
        className={className}
      >
        <Link href={action.href} onClick={action.onClick}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={action.variant ?? 'default'}
      disabled={action.disabled || isLoading}
      onClick={action.onClick}
      className={className}
    >
      {content}
    </Button>
  );
}
