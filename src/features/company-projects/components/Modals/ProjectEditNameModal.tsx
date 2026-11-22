'use client';

import { useRef, useState } from 'react';
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
  onSave: (projectId: string, name: string) => Promise<void>;
  isSaving?: boolean;
};

export default function ProjectEditNameModal({
  project,
  onClose,
  onSave,
  isSaving = false,
}: ProjectEditNameModalProps) {
  const t = useTranslations('companyPage.projects');
  const [name, setName] = useState(project.name);
  // Blocks a second click before `isSaving` re-renders.
  const inFlight = useRef(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (inFlight.current || !trimmedName || trimmedName === project.name)
      return;
    inFlight.current = true;
    try {
      await onSave(project.id, trimmedName);
      onClose();
    } catch {
      // The mutation hook shows the error; keep the modal open to retry.
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <Modal open onOpenChange={(open) => !open && !isSaving && onClose()}>
      <ModalContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[800px] gap-6 rounded-[24px] p-6"
      >
        <ModalHeader className="border-b border-border pb-4 text-start">
          <div className="flex items-center justify-between gap-4">
            <ModalTitle className="text-xl font-bold sm:text-[28px]">
              {t('edit-project-title')}
            </ModalTitle>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label={t('close')}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
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
            disabled={isSaving}
            className="h-12 rounded-full bg-muted/60"
          />
        </div>
        <Button
          type="button"
          size="pill"
          className="h-[52px]"
          disabled={isSaving || !name.trim() || name.trim() === project.name}
          onClick={() => void handleSave()}
        >
          {isSaving ? t('saving') : t('save-changes')}
        </Button>
      </ModalContent>
    </Modal>
  );
}
