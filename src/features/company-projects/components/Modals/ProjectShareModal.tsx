'use client';

import { useRef, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
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
import { projectShareMessage } from '../../constants/project-preview-data';
import { useGetHiringManagers } from '../../hooks/useGetHiringManagers';
import { useShareProject } from '../../hooks/useShareProject';
import type { CompanyProject } from '../../types/company-projects.types';

type ProjectShareModalProps = {
  project: CompanyProject;
  onClose: () => void;
};

export default function ProjectShareModal({
  project,
  onClose,
}: ProjectShareModalProps) {
  const t = useTranslations('companyPage.projects');
  const [modalContent, setModalContent] = useState<HTMLDivElement | null>(null);
  const [managerId, setManagerId] = useState('');
  const [message, setMessage] = useState(projectShareMessage);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const managers = useGetHiringManagers();
  const shareMutation = useShareProject();
  const isPending = shareMutation.isPending;
  // Blocks a second click before `isPending` re-renders.
  const inFlight = useRef(false);
  // Sharing again with the same hiring manager fails on the API, so managers
  // the project is already shared with are left out.
  const sharedIds = project.shareLogs.map((log) => log.id);
  const managerOptions = (managers.data ?? [])
    .filter((item) => !sharedIds.includes(item.id))
    .map((item) => ({ value: item.id, label: item.name }));
  const manager =
    managerOptions.find((item) => item.value === managerId)?.label ?? '';
  const noManagers = managers.isSuccess && !managers.data.length;
  const allShared =
    managers.isSuccess && managers.data.length > 0 && !managerOptions.length;

  const submit = () => {
    if (inFlight.current || !managerId || !message.trim()) return;
    inFlight.current = true;
    shareMutation.mutate(
      { projectId: project.id, managerId, note: message },
      {
        onSuccess: () => setIsSubmitted(true),
        onSettled: () => {
          inFlight.current = false;
        },
      },
    );
  };

  return (
    <>
      <Modal
        open={!isSubmitted}
        onOpenChange={(open) => !open && !isPending && onClose()}
      >
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
                disabled={isPending}
                aria-label={t('close')}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
          </ModalHeader>

          <div className="space-y-5">
            <SelectInputField
              id="project-hiring-manager"
              label={t('hiring-manager')}
              options={managerOptions}
              value={managerId}
              onChange={setManagerId}
              placeholder={t(
                managers.isLoading
                  ? 'loading-hiring-managers'
                  : 'select-hiring-manager',
              )}
              disabled={isPending || !managerOptions.length}
              className="h-12 bg-card"
              portalContainer={modalContent}
            />
            {managers.isError ? (
              <p role="alert" className="flex items-center gap-2 text-sm">
                <span className="text-destructive">
                  {t('hiring-managers-error')}
                </span>
                <button
                  type="button"
                  onClick={() => void managers.refetch()}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {t('retry')}
                </button>
              </p>
            ) : null}
            {noManagers || allShared ? (
              <p className="text-sm text-muted-foreground">
                {t(noManagers ? 'no-hiring-managers' : 'all-managers-shared')}
              </p>
            ) : null}
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
                disabled={isPending}
                className="min-h-48 resize-y rounded-2xl bg-muted/60 p-4 text-sm leading-6"
              />
            </div>
          </div>

          <Button
            type="button"
            size="pill"
            className="h-12 w-full"
            disabled={!managerId || !message.trim() || isPending}
            onClick={submit}
          >
            {isPending && (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            )}
            {t(isPending ? 'sharing' : 'submit')}
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
        visualClassName="h-40 w-38 sm:h-[242px] sm:w-[230px]"
        visualWrapperClassName="mt-0 mb-7"
        callout={{
          title: t('share-success-callout-title'),
          description: t('share-success-callout-description'),
        }}
        className="max-w-[700px] rounded-[28px] p-5 sm:p-10"
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
