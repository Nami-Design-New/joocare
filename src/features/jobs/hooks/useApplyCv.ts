import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ApplyCvSource } from '../types/job-apply.types';
import { useCandidateCvProfile } from './useCandidateCvProfile';

// CV choice when applying: the profile CV or a file uploaded for this application only.
export function useApplyCv() {
  const t = useTranslations('jobDetailsPage.toasts');
  const profileQuery = useCandidateCvProfile();
  const [pickedSource, setPickedSource] = useState<ApplyCvSource | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileCv = profileQuery.data?.cv ?? null;
  const source: ApplyCvSource =
    pickedSource ?? (profileCv ? 'profile' : 'upload');
  const canSubmit =
    !isUploading &&
    (source === 'profile' ? Boolean(profileCv) : Boolean(uploadedPath));

  const selectSource = (next: ApplyCvSource) => {
    setPickedSource(next);
    setError(null);
  };

  const handleUploaded = (path: string | null) => {
    setUploadedPath(path);
    setError(null);
    if (path) setPickedSource('upload');
  };

  // Returns false (and shows the error) when no CV is ready to send.
  const validate = () => {
    if (canSubmit) return true;
    setError(t('upload-cv-first'));
    return false;
  };

  return {
    profileCv,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error ? t('failed-load-cv') : null,
    source,
    selectSource,
    files,
    setFiles,
    handleUploaded,
    setIsUploading,
    error,
    setError,
    // `null` sends the profile CV (the API's default).
    cvPath: source === 'upload' ? uploadedPath : null,
    validate,
  };
}

export type ApplyCvState = ReturnType<typeof useApplyCv>;
