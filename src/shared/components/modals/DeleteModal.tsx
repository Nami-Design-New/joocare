'use client';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonVariant?: VariantProps<typeof buttonVariants>['variant'];
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
};
export default function DeleteModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm deletion',
  cancelLabel = 'Back',
  onConfirm,
  confirmButtonVariant = 'destructive',
  onCancel,
  isLoading = false,
  className,
}: ConfirmDialogProps) {
  const t = useTranslations();
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('max-w-150 rounded-2xl p-5 text-center sm:p-8', className)}
      >
        <div className="flex w-full items-center justify-center">
          <div className="size-32 sm:size-50">
            <Image
              src="/assets/gif/trash-icon.gif"
              alt=""
              width={200}
              height={200}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <DialogHeader className="">
          <DialogTitle className="text-foreground text-center text-2xl md:text-3xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-foreground text-center text-base md:text-lg leading-tight">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex w-full gap-2">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant={confirmButtonVariant}
              size="pill"
              className="grow"
            >
              {isLoading ? t('common.saving') : confirmLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={handleCancel}
              disabled={isLoading}
              className="grow"
            >
              {cancelLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
