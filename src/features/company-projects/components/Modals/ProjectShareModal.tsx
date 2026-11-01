'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  hiringManagers,
  projectShareMessage,
} from '../../constants/project-preview-data';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectShareModalProps = {
  project: CompanyProject;
  onClose: () => void;
  onShare: (projectId: string, manager: string) => void;
};

export default function ProjectShareModal({
  project,
  onClose,
  onShare,
}: ProjectShareModalProps) {
  const t = useTranslations('companyPage.projects');
  const [modalContent, setModalContent] = useState<HTMLDivElement | null>(
    null,
  );
  const [manager, setManager] = useState('');
  const [message, setMessage] = useState(projectShareMessage);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <Modal open={!isSubmitted} onOpenChange={(open) => !open && onClose()}>
        <ModalContent
          ref={setModalContent}
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[780px] gap-6 overflow-visible rounded-[24px] p-6"
        >
          <ModalHeader className="text-start">
            <div className="flex items-center justify-between gap-4">
              <ModalTitle className="text-xl font-bold sm:text-[28px]">
                {t('share-project-title')}
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

          <div className="space-y-5">
            <SelectInputField
              id="project-hiring-manager"
              label={t('hiring-manager')}
              options={hiringManagers.map((value) => ({ value, label: value }))}
              value={manager}
              onChange={setManager}
              placeholder={t('select-hiring-manager')}
              className="bg-card h-12"
              portalContainer={modalContent}
            />
            <div className="space-y-2">
              <label
                htmlFor="project-share-message"
                className="text-sm font-semibold"
              >
                {t('message')}
              </label>
              <Textarea
                id="project-share-message"
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
            disabled={!manager || !message.trim()}
            onClick={() => {
              onShare(project.id, manager);
              setIsSubmitted(true);
            }}
          >
            {t('submit')}
          </Button>
        </ModalContent>
      </Modal>

      <SuccessModal
        open={isSubmitted}
        onOpenChange={(open) => !open && onClose()}
        title={t('share-success-title')}
        description={t('share-success-description', { manager })}
        visual={
          <Image
            src="/assets/company-projects/share-success.png"
            alt=""
            width={230}
            height={242}
            className="h-full w-full object-contain"
          />
        }
        visualClassName="h-[242px] w-[230px]"
        visualWrapperClassName="mt-0 mb-7"
        callout={{
          title: t('share-success-callout-title'),
          description: t('share-success-callout-description'),
        }}
        className="max-w-[700px] rounded-[28px] p-10"
        primaryAction={{
          label: t('go-to-projects'),
          href: '/company/projects',
          variant: 'outline',
        }}
        secondaryAction={{
          label: t('back-to-dashboard'),
          href: '/company/dashboard',
          variant: 'default',
        }}
      />
    </>
  );
}
