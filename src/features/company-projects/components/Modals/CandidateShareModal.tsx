'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  hiringManagers,
  projectShareMessage,
} from '../../constants/project-preview-data';
import type { ProjectCandidate } from '../../types/company-projects.types';

type CandidateShareModalProps = {
  candidate: ProjectCandidate;
  onClose: () => void;
};

export default function CandidateShareModal({
  candidate,
  onClose,
}: CandidateShareModalProps) {
  const t = useTranslations('companyPage.projects');
  const [manager, setManager] = useState(hiringManagers[0]);
  const [message, setMessage] = useState(projectShareMessage);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <Modal open={!isSubmitted} onOpenChange={(open) => !open && onClose()}>
        <ModalContent className="w-[calc(100%-2rem)] max-w-2xl gap-6 rounded-[24px] p-6 sm:p-8">
          <ModalHeader className="text-start">
            <ModalTitle className="text-xl font-bold sm:text-2xl">
              {t('share-candidate-title')}
            </ModalTitle>
            <ModalDescription>{candidate.name}</ModalDescription>
          </ModalHeader>

          <div className="space-y-5">
            <SelectInputField
              id="candidate-hiring-manager"
              label={t('hiring-manager')}
              options={hiringManagers.map((value) => ({ value, label: value }))}
              value={manager}
              onChange={setManager}
              className="bg-card h-12"
            />
            <div className="space-y-2">
              <label
                htmlFor="candidate-share-message"
                className="text-sm font-semibold"
              >
                {t('message')}
              </label>
              <Textarea
                id="candidate-share-message"
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                className="bg-muted/60 min-h-48 resize-y rounded-2xl p-4 text-sm leading-6"
              />
            </div>
          </div>

          <Button
            type="button"
            size="pill"
            className="h-12 w-full"
            disabled={!message.trim()}
            onClick={() => setIsSubmitted(true)}
          >
            {t('submit')}
          </Button>
        </ModalContent>
      </Modal>

      <SuccessModal
        open={isSubmitted}
        onOpenChange={(open) => !open && onClose()}
        title={t('candidate-share-success')}
        description={t('candidate-share-success-description', { manager })}
        primaryAction={{ label: t('done'), onClick: onClose }}
      />
    </>
  );
}
