'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
} from '@/shared/components/ui/dialog';
import type { ProjectCandidateRef } from '../../types/company-projects.types';
import {
  createCreateProjectSchema,
  type TCreateProjectSchema,
} from '../../validation/create-project-schema';
import ProjectModalHeader from './ProjectModalHeader';

type CreateProjectModalProps = {
  candidate: ProjectCandidateRef;
  onClose: () => void;
  onCreate: (values: TCreateProjectSchema) => Promise<void>;
};

export default function CreateProjectModal({
  candidate,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const schema = useMemo(
    () =>
      createCreateProjectSchema({
        nameRequired: t('name-required'),
        nameTooLong: t('name-too-long'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCreateProjectSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <ModalContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-200 gap-6 rounded-3xl border-0 bg-card p-6 sm:min-w-0"
      >
        <ProjectModalHeader
          title={t('create-title')}
          disabled={isSubmitting}
          className="border-b border-border pb-4"
        />
        <ModalDescription className="sr-only">
          {t('create-description', { name: candidate.name })}
        </ModalDescription>
        <form
          onSubmit={handleSubmit(onCreate)}
          className="flex flex-col gap-6"
          aria-busy={isSubmitting}
        >
          <InputField
            id="create-project-name"
            label={t('project-name')}
            placeholder={t('project-name-placeholder')}
            autoFocus
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register('name')}
          />
          <Button type="submit" size="pill" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            )}
            {t(isSubmitting ? 'creating' : 'create-submit')}
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
}
