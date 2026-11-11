'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import type { ProjectCandidate } from '../../types/company-projects.types';

type CandidateInterviewModalProps = {
  candidate: ProjectCandidate;
  projectName: string;
  onClose: () => void;
};

export default function CandidateInterviewModal({
  candidate,
  projectName,
  onClose,
}: CandidateInterviewModalProps) {
  const t = useTranslations('companyPage.projects');
  const details = [
    { label: t('interview-date'), value: candidate.interviewDate },
    { label: t('interview-time'), value: candidate.interviewTime },
    { label: t('interview-method'), value: candidate.interviewType },
    {
      label: t('scheduled-by'),
      value: [candidate.scheduledBy, candidate.scheduledByRole]
        .filter(Boolean)
        .join(' · '),
    },
  ];

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="w-[calc(100%-2rem)] max-w-[520px] gap-0 rounded-[24px] p-7">
        <ModalHeader className="mb-5 text-start">
          <ModalTitle className="text-xl font-bold">
            {t('interview-details')}
          </ModalTitle>
          <ModalDescription>
            {candidate.name} · {projectName}
          </ModalDescription>
        </ModalHeader>

        <dl className="overflow-hidden rounded-2xl border border-border bg-body-bg">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex min-h-11 items-center justify-between gap-4 border-b border-border px-4 py-2 last:border-b-0"
            >
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-end text-sm font-semibold text-foreground">
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            {t('recruiter-note')}
          </h3>
          <p className="rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-foreground">
            {candidate.note ?? t('no-interview-note')}
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}
