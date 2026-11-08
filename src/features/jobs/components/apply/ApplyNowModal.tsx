'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { CANDIDATE_PROFILE_HREF } from '../../constants';
import { useApplyCv } from '../../hooks/useApplyCv';
import { useApplyToJob } from '../../hooks/useApplyToJob';
import ApplyCvPicker from './ApplyCvPicker';

type ApplyNowModalProps = {
  jobId: number;
  onClose: () => void;
  onApplied: () => void;
};

// Apply flow without screening questions: pick the CV and apply.
export default function ApplyNowModal({
  jobId,
  onClose,
  onApplied,
}: ApplyNowModalProps) {
  const t = useTranslations('jobDetailsPage');
  const cv = useApplyCv();
  const applyMutation = useApplyToJob(jobId, onApplied);
  const showProfileLink = !cv.isLoadingProfile && !cv.profileCv;

  const apply = () => {
    if (!cv.validate()) return;
    applyMutation.mutate({ cvPath: cv.cvPath });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && !applyMutation.isPending && onClose()}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-175 overflow-y-auto rounded-2xl p-5 sm:max-w-175 sm:p-8">
        <div className="flex flex-col gap-6">
          <DialogHeader className="pe-8 text-start">
            <DialogTitle className="text-foreground text-2xl sm:text-[28px]">
              {t('cv-submission-required')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              {t('cv-submission-description')}
            </DialogDescription>
          </DialogHeader>

          <ApplyCvPicker cv={cv} layout="divider" />

          {showProfileLink ? (
            <Button
              asChild
              variant="ghost"
              size="pill"
              className="-mt-3 self-start"
            >
              <Link href={CANDIDATE_PROFILE_HREF} onClick={onClose}>
                {t('go-to-profile')}
              </Link>
            </Button>
          ) : null}

          <DialogFooter className="justify-center! sm:justify-center">
            <Button
              type="button"
              size="pill"
              onClick={apply}
              disabled={applyMutation.isPending || cv.isLoadingProfile}
              className="bg-assessment-primary hover:bg-assessment-primary/90 w-full sm:w-50"
            >
              {applyMutation.isPending ? t('applying') : t('apply-now')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
