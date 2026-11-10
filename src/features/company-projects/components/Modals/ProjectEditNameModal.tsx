'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectEditNameModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onSave: (projectId: string, name: string) => void;
};

export default function ProjectEditNameModal({
  project,
  onClose,
  onSave,
}: ProjectEditNameModalProps) {
  const t = useTranslations('companyPage.projects');
  const [name, setName] = useState(project.name);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === project.name) return;
    onSave(project.id, trimmedName);
    onClose();
  };

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[800px] gap-6 rounded-[24px] p-6"
      >
        <ModalHeader className="border-border border-b pb-4 text-start">
          <div className="flex items-center justify-between gap-4">
            <ModalTitle className="text-xl font-bold sm:text-[28px]">
              {t('edit-project-title')}
            </ModalTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('close')}
              className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        </ModalHeader>
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-semibold">
            {t('project-name')}
          </label>
          <Input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            className="bg-muted/60 h-12 rounded-full"
          />
        </div>
        <Button
          type="button"
          size="pill"
          className="h-[52px]"
          disabled={!name.trim() || name.trim() === project.name}
          onClick={handleSave}
        >
          {t('save-changes')}
        </Button>
      </ModalContent>
    </Modal>
  );
}
