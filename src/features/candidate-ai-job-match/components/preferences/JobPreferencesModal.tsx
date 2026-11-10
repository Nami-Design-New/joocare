'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ModalHeading from '@/shared/components/modals/ModalHeading';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import type {
  JobPreferences,
  JobPreferencesMode,
} from '../../types/ai-job-match.types';
import JobPreferencesForm from './JobPreferencesForm';

type JobPreferencesModalProps = {
  open: boolean;
  mode: JobPreferencesMode;
  preferences: JobPreferences | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: JobPreferences) => void;
};

export default function JobPreferencesModal({
  open,
  mode,
  preferences,
  onOpenChange,
  onSave,
}: JobPreferencesModalProps) {
  const t = useTranslations('candidatePage.aiJobMatch.preferences');
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={setContentElement}
        className="max-h-[90dvh] gap-6 overflow-y-auto sm:max-w-250"
      >
        <ModalHeading
          title={t(mode === 'add' ? 'add-title' : 'edit-title')}
          titleClassName="text-foreground"
        />
        {open && (
          <JobPreferencesForm
            mode={mode}
            preferences={preferences}
            portalContainer={contentElement}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
