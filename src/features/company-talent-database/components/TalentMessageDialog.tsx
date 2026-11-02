'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, LoaderCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TextareaField } from '@/shared/components/TextareaField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type {
  TalentCandidate,
  TalentMessageValues,
} from '../types/talent-database.types';
import { createTalentMessageSchema } from '../validation/talent-message-schema';

type TalentMessageDialogProps = {
  candidates: TalentCandidate[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onSend: (values: TalentMessageValues) => Promise<void>;
};

export default function TalentMessageDialog({
  candidates,
  onRemove,
  onClose,
  onSend,
}: TalentMessageDialogProps) {
  const t = useTranslations('companyPage.talent-database');
  const schema = useMemo(
    () =>
      createTalentMessageSchema({
        required: t('message-required'),
        tooLong: t('message-too-long'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TalentMessageValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: t('default-message') },
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="bg-card w-[calc(100%-2rem)] max-w-195 gap-8 rounded-3xl border-0 p-6 sm:min-w-0"
        onEscapeKeyDown={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isSubmitting) event.preventDefault();
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <DialogTitle className="text-[28px] leading-tight font-semibold">
            {t('send-message')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon-circle"
              aria-label={t('close')}
              disabled={isSubmitting}
            >
              <X className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          {t('recipients', { count: candidates.length })}
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSend)}
          className="flex flex-col gap-6"
          aria-busy={isSubmitting}
        >
          <p className="font-semibold" aria-live="polite">
            {t('recipients', { count: candidates.length })}
          </p>
          <div className="flex min-h-8 flex-wrap gap-2">
            {candidates.map((candidate) => (
              <span
                key={candidate.id}
                className="bg-primary/10 text-primary border-primary flex items-center gap-2 rounded-full border py-1.5 ps-3.5 pe-2 text-sm font-medium"
              >
                <bdi>{candidate.name}</bdi>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onRemove(candidate.id)}
                  aria-label={t('remove-recipient', { name: candidate.name })}
                  className="rounded-full p-0.5 focus-visible:outline-2"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
          {!candidates.length && (
            <p role="alert" className="text-destructive text-sm">
              {t('recipient-required')}
            </p>
          )}
          <TextareaField
            id="talent-message"
            label={t('message')}
            {...register('message')}
            error={errors.message?.message}
            disabled={isSubmitting}
            className="border-assessment-outline bg-card mt-5 min-h-40 rounded-2xl px-4 py-3.5 text-[15px] shadow-none"
          />
          <aside className="border-assessment-link-info-border bg-assessment-link-info text-assessment-link-info-text flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed">
            <Info aria-hidden className="mt-0.5 size-4.5 shrink-0" />
            <div>
              <h3 className="mb-1 font-semibold">{t('send-individually')}</h3>
              <p>{t('individual-description')}</p>
            </div>
          </aside>
          <Button
            size="pill"
            type="submit"
            disabled={!candidates.length || isSubmitting}
            className="mt-2 w-full"
          >
            {isSubmitting && (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            )}
            {t(isSubmitting ? 'sending' : 'send')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
