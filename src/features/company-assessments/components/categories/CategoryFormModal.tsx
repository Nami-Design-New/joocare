'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoaderCircle, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { TextareaField } from '@/shared/components/TextareaField';
import ModalHeading from '@/shared/components/modals/ModalHeading';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@/shared/components/ui/dialog';
import { createCategorySchema } from '../../validation/category-schema';
import type {
  AssessmentCategory,
  CategoryFormValues,
} from '../../types/assessment.types';

type CategoryFormModalProps = {
  category: AssessmentCategory | null;
  onClose: () => void;
  onSave: (values: CategoryFormValues) => boolean;
};

export default function CategoryFormModal({
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const t = useTranslations('companyPage.assessments');
  const locale = useLocale();
  const schema = useMemo(
    () =>
      createCategorySchema({
        nameRequired: t('validation.name-required'),
        descriptionRequired: t('validation.description-required'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        showCloseButton={false}
        aria-describedby={undefined}
        className="w-[calc(100%_-_2rem)] max-w-150 gap-8 rounded-2xl p-6 sm:min-w-0"
      >
        <div className="flex items-center justify-between gap-4">
          <ModalHeading
            title={t(category ? 'edit-category' : 'create-category')}
            className="text-start sm:text-start"
            titleClassName="text-2xl sm:text-[28px]"
          />
          <DialogClose asChild>
            <Button
              size="icon-circle"
              aria-label={t('close')}
              disabled={isSubmitting}
            >
              <X aria-hidden="true" className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <form
          noValidate
          className="space-y-6"
          onSubmit={handleSubmit((values) => {
            if (!onSave(values)) setError('root', { message: t('save-error') });
          })}
        >
          <InputField
            id="assessment-category-name"
            label={t('category-name')}
            placeholder={t('category-placeholder')}
            error={errors.name?.message}
            {...register('name')}
            disabled={isSubmitting}
            containerStyles="[&>span]:text-destructive"
          />
          <TextareaField
            id="assessment-category-description"
            label={t('category-description')}
            placeholder={t('category-placeholder')}
            error={errors.description?.message}
            {...register('description')}
            disabled={isSubmitting}
            className="bg-muted min-h-25 resize-y rounded-2xl p-4"
            containerStyles="[&>span]:text-destructive"
          />
          {errors.root ? (
            <p role="alert" className="text-destructive text-sm">
              {errors.root.message}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 rounded-full"
          >
            {isSubmitting ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : null}
            {t(category ? 'save' : 'create')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
