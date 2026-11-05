'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { CandidateExperienceViewModel } from '../../types/profile.types';
import ExperienceForm from './ExperienceForm';

type ExperienceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  experience?: CandidateExperienceViewModel | null;
};

export function ExperienceModal({
  open,
  onOpenChange,
  label,
  experience,
}: ExperienceModalProps) {
  const [dialogContentElement, setDialogContentElement] =
    useState<HTMLDivElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setDialogContentElement} className="max-w-175 gap-5">
        <DialogHeader>
          <DialogTitle className="text-foreground text-[28px]">
            {label}
          </DialogTitle>
        </DialogHeader>

        <ExperienceForm
          key={experience?.id ?? 'new'}
          experience={experience}
          portalContainer={dialogContentElement}
          onSaved={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
