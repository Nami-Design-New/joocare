'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SuccessModal from './SuccessModal';

const PASSWORD_SUCCESS_DELAY_MS = 2000;

type PasswordChangedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PasswordChangedModal({
  open,
  onOpenChange,
}: PasswordChangedModalProps) {
  const t = useTranslations('common.password-validation');

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(
      () => onOpenChange(false),
      PASSWORD_SUCCESS_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, onOpenChange]);

  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('changed-successfully')}
      description=""
      visual={
        <Image
          src="/assets/modal/password-changed-success.gif"
          alt=""
          aria-hidden
          unoptimized
          width={300}
          height={300}
          className="size-48 sm:size-75"
        />
      }
      className="w-[calc(100%-2rem)] max-w-175 gap-0 rounded-3xl px-5 pt-16 pb-8 sm:min-w-0 sm:px-8 sm:pt-30 sm:pb-16 [&_[data-slot=dialog-close]]:start-8 [&_[data-slot=dialog-close]]:end-auto [&_[data-slot=dialog-close]]:top-8 [&_[data-slot=dialog-close]]:flex [&_[data-slot=dialog-close]]:size-8 [&_[data-slot=dialog-close]]:items-center [&_[data-slot=dialog-close]]:justify-center [&_[data-slot=dialog-description]]:hidden [&_[data-slot=dialog-title]]:text-2xl sm:[&_[data-slot=dialog-title]]:text-[28px]"
      visualClassName="size-48 sm:size-75"
      visualWrapperClassName="mt-0 mb-2"
    />
  );
}
