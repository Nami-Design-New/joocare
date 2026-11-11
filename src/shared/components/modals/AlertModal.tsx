'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button, buttonVariants } from '../ui/button';
import { useRef } from 'react';
import animationData from '../../../../public/assets/lottie/warning.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonVariant?: VariantProps<typeof buttonVariants>['variant'];
  hasCancelButton?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Back',
  onConfirm,
  confirmButtonVariant = 'default',
  hasCancelButton = true,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150 rounded-2xl p-5 text-center sm:p-8">
        <div className="mt-8 mb-6 flex w-full items-center justify-center sm:mt-15 sm:mb-12">
          <div className="h-40 w-40 sm:h-50 sm:w-50">
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              height={200}
              width={200}
              autoplay={true}
              loop={true}
            />
          </div>
        </div>
        <DialogHeader className="">
          <DialogTitle className="text-center text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="mt-2 text-center text-base leading-tight text-foreground md:text-lg">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex w-full gap-2">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant={confirmButtonVariant}
              size="pill"
              className="grow max-sm:w-auto max-sm:px-2 max-sm:text-xs"
            >
              {isLoading ? t('common.saving') : confirmLabel}
            </Button>
            {hasCancelButton && (
              <Button
                type="button"
                variant="outline"
                size="pill"
                onClick={handleCancel}
                disabled={isLoading}
                className="grow max-sm:w-auto max-sm:px-2 max-sm:text-xs"
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
