'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import ChoiceOptionCard from '@/shared/components/questions/ChoiceOptionCard';
import { StoredFilepondUpload } from '@/shared/components/StoredFilepondUpload';
import { getFileNameFromUrl } from '@/shared/lib/file-name';
import { storeUploadedFile } from '@/shared/services/store-uploaded-file-service';
import { resolveStorageUrl } from '@/shared/lib/storage-url';
import { cn } from '@/shared/lib/utils';
import { APPLY_CV_ACCEPTED_TYPES } from '../../constants';
import type { ApplyCvState } from '../../hooks/useApplyCv';
import ProfileCvLabel from './ProfileCvLabel';

type ApplyCvPickerProps = {
  cv: ApplyCvState;
  /** `cards`: two radio cards (apply with questions); `divider`: profile CV, "OR", upload. */
  layout: 'cards' | 'divider';
};

const SOURCE_NAME = 'apply-cv-source';

// Profile CV or a file uploaded for this application only (shared by both apply modals).
export default function ApplyCvPicker({ cv, layout }: ApplyCvPickerProps) {
  const t = useTranslations('jobDetailsPage');
  const locale = useLocale();
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const profileCvUrl = resolveStorageUrl(cv.profileCv);
  const profileCvName =
    getFileNameFromUrl(cv.profileCv) || t('apply.cv.profile-cv');
  const hasProfileCv = Boolean(cv.profileCv);

  if (cv.isLoadingProfile) {
    return (
      <p className="rounded-xl border border-border px-5 py-6 text-sm text-muted-foreground">
        {t('loading-cv')}
      </p>
    );
  }

  const profileOption = hasProfileCv ? (
    <ChoiceOptionCard
      type="radio"
      name={SOURCE_NAME}
      value="profile"
      checked={cv.source === 'profile'}
      onChange={() => cv.selectSource('profile')}
      className="p-5"
      label={
        <ProfileCvLabel
          fileName={profileCvName}
          canPreview={Boolean(profileCvUrl)}
          onPreview={() => setPreviewOpen(true)}
        />
      }
    />
  ) : null;

  const uploadField = (
    <StoredFilepondUpload
      label={
        layout === 'divider'
          ? t(hasProfileCv ? 'upload-new-cv' : 'upload-cv')
          : undefined
      }
      files={cv.files}
      onChange={cv.setFiles}
      maxFiles={1}
      acceptedFileTypes={APPLY_CV_ACCEPTED_TYPES}
      existingFileUrl={null}
      processFile={(file) => storeUploadedFile({ file, locale })}
      onStoredPathChange={cv.handleUploaded}
      onUploadingChange={cv.setIsUploading}
      onUploadError={cv.setError}
      error={cv.error ?? cv.profileError ?? undefined}
      className={cn(
        '[&_.filepond--drop-label]:bg-muted [&_.filepond--panel-root]:border [&_.filepond--panel-root]:border-border [&_.filepond--panel-root]:bg-muted [&_.filepond--root]:mb-0',
        layout === 'cards' &&
          hasProfileCv &&
          cv.source !== 'upload' &&
          'opacity-60',
      )}
    />
  );

  return (
    <>
      {layout === 'cards' ? (
        <div
          role="radiogroup"
          aria-label={t('apply.cv.title')}
          className="flex flex-col gap-8"
        >
          {profileOption}
          <div className="flex flex-col gap-3">
            {hasProfileCv ? (
              <ChoiceOptionCard
                type="radio"
                name={SOURCE_NAME}
                value="upload"
                checked={cv.source === 'upload'}
                onChange={() => cv.selectSource('upload')}
                className="p-5"
                label={
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t('apply.cv.upload-title')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t('apply.cv.upload-description')}
                    </span>
                  </span>
                }
              />
            ) : null}
            {uploadField}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-5">
          {profileOption}
          {hasProfileCv ? (
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-foreground">
                {t('or')}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          ) : null}
          {uploadField}
        </div>
      )}

      {isPreviewOpen ? (
        <CvFileModal
          open
          onOpenChange={setPreviewOpen}
          title={profileCvName}
          pdfUrl={profileCvUrl}
        />
      ) : null}
    </>
  );
}
