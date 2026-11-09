'use client';

import { cva } from 'class-variance-authority';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import LoginAlertModal from '@/shared/components/modals/LoginAlertModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { useToggleSavedJob } from '../../hooks/useToggleSavedJob';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import ApplicationIcon from './ApplicationIcon';

const savedPillVariants = cva('border-border text-sm', {
  variants: {
    appearance: {
      default: 'h-9 px-4 py-2',
      applications: 'h-8.5 gap-1 px-3 font-normal',
    },
    saved: { true: '', false: 'text-muted-foreground' },
  },
  compoundVariants: [
    {
      appearance: 'default',
      saved: true,
      className: 'bg-accent text-primary hover:bg-accent/90',
    },
    { appearance: 'applications', saved: false, className: 'bg-muted' },
    {
      appearance: 'applications',
      saved: true,
      className:
        'bg-application-primary text-primary-foreground hover:bg-application-primary/90',
    },
  ],
});

type ToggleSavedJobButtonProps = {
  jobId: number;
  initialIsSaved: boolean;
  variant?: 'icon' | 'pill';
  className?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
  appearance?: 'default' | 'applications';
};

export default function ToggleSavedJobButton({
  jobId,
  initialIsSaved,
  variant = 'pill',
  className = '',
  onSavedChange,
  appearance = 'default',
}: ToggleSavedJobButtonProps) {
  const t = useTranslations();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const { isSaved, toggleSaved, isPending } = useToggleSavedJob(
    jobId,
    initialIsSaved,
    {
      onSavedChange,
      onAuthRequired: () => setLoginModalOpen(true),
      onSaved: () => setSavedModalOpen(true),
    },
  );


  // "Saved successfully" confirmation (close only) after saving a job.
  const savedModal = (
    <SuccessModal
      open={savedModalOpen}
      onOpenChange={setSavedModalOpen}
      title={t('common.job-saved-modal.title')}
      description={t('common.job-saved-modal.description')}
    />
  );

  if (variant === 'icon') {
    return (
      <>
        <LoginAlertModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
        />
        {savedModal}
        <Button
          type="button"
          size="icon"
          disabled={isPending}
          onClick={toggleSaved}
          className={`h-13 w-13 rounded-[4px] p-4 ${
            isSaved
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-accent text-primary'
          } ${className}`}
          aria-pressed={isSaved}
          aria-label={isSaved ? t('common.unSave-job') : t('common.save-job')}
        >
          <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
        </Button>
      </>
    );
  }

  return (
    <>
      <LoginAlertModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
        {savedModal}
      <Button
        type="button"
        variant="outline"
        size="pill"
        disabled={isPending}
        onClick={toggleSaved}
        className={cn(
          savedPillVariants({ appearance, saved: isSaved }),
          className,
        )}
        aria-pressed={isSaved}
      >
        {appearance === 'applications' ? (
          <ApplicationIcon name={isSaved ? 'saved' : 'save'} size={14} />
        ) : (
          <Bookmark fill={isSaved ? 'currentColor' : 'none'} />
        )}
        {isSaved ? t('common.saved') : t('common.save')}
      </Button>
    </>
  );
}
