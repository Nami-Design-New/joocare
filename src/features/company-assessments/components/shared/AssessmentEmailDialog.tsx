'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { InputField } from '@/shared/components/InputField';
import { assessmentBodyFont } from '../../constants/assessment-fonts';
import { ASSESSMENT_ASSETS } from '../../constants/assessment-invitations';
import { createAssessmentEmailSchema } from '../../validation/assessment-email-schema';

type AssessmentEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (email: string) => void;
};

function EmailForm({
  onAdd,
  onCancel,
}: {
  onAdd: (email: string) => void;
  onCancel: () => void;
}) {
  const t = useTranslations('companyPage.assessments.assignment');
  const schema = useMemo(
    () => createAssessmentEmailSchema(t('invalid-email')),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });
  return (
    <form
      onSubmit={handleSubmit(({ email }) => onAdd(email))}
      className={assessmentBodyFont.className}
    >
      <div className="pt-6">
        <InputField
          id="assessment-external-email"
          label={t('email-label')}
          type="email"
          autoFocus
          placeholder={t('email-placeholder')}
          {...register('email')}
          error={errors.email?.message}
          className="border-assessment-border text-assessment-muted bg-card mt-1 h-12 rounded-2xl px-4 text-sm shadow-none"
          containerStyles="text-sm leading-5"
        />
      </div>
      <div className="mt-7 flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-assessment-border bg-assessment-control text-assessment-heading h-9 rounded-[10px] px-4 text-sm font-medium shadow-sm"
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="bg-assessment-action h-9 rounded-[10px] px-4 text-sm font-medium shadow-sm"
        >
          {t('add')}
        </Button>
      </div>
    </form>
  );
}

export default function AssessmentEmailDialog({
  open,
  onOpenChange,
  onAdd,
}: AssessmentEmailDialogProps) {
  const t = useTranslations('companyPage.assessments.assignment');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="border-assessment-border bg-card w-[calc(100%-2rem)] max-w-[448px] gap-0 rounded-[20px] p-6 sm:min-w-0"
      >
        <div className="flex h-9 items-center justify-between">
          <DialogTitle className="text-assessment-heading text-xl leading-7 font-semibold">
            {t('add-email-title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('close')}
              className="size-9 rounded-[10px]"
            >
              <Image
                src={`${ASSESSMENT_ASSETS}/close.svg`}
                width={16}
                height={16}
                alt=""
              />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          {t('add-email-title')}
        </DialogDescription>
        {open ? (
          <EmailForm onAdd={onAdd} onCancel={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
