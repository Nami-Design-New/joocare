'use client';

import Image from 'next/image';
import { Eye, FileText, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

type CandidateRowActionsProps = {
  name: string;
  onMessage: () => void;
  // A plain link downloads directly; a callback runs an authorized download.
  downloadHref?: string;
  onDownload?: () => void;
  isDownloading?: boolean;
  viewHref?: string;
  onView?: () => void;
  viewKind?: 'cv' | 'profile';
};

const BUTTON_CLASS = 'h-8 w-16 min-w-0 rounded-full p-0';

export default function CandidateRowActions({
  name,
  onMessage,
  downloadHref,
  onDownload,
  isDownloading = false,
  viewHref,
  onView,
  viewKind = 'cv',
}: CandidateRowActionsProps) {
  const t = useTranslations('common.candidate-row');
  const viewLabel = t(viewKind === 'cv' ? 'view-cv' : 'view-profile', {
    name,
  });

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        size="sm"
        aria-label={t('message-candidate', { name })}
        onClick={onMessage}
        className={BUTTON_CLASS}
      >
        <Image
          src="/assets/company-projects/candidate-share.svg"
          alt=""
          width={14}
          height={14}
        />
      </Button>
      {downloadHref ? (
        <Button asChild variant="secondary" size="sm" className={BUTTON_CLASS}>
          <a
            href={downloadHref}
            download={`${name} CV.pdf`}
            aria-label={t('download-cv', { name })}
          >
            <FileText aria-hidden className="size-4" />
          </a>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          aria-label={t(isDownloading ? 'downloading-cv' : 'download-cv', {
            name,
          })}
          onClick={onDownload}
          disabled={!onDownload || isDownloading}
          className={BUTTON_CLASS}
        >
          {isDownloading ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <FileText aria-hidden className="size-4" />
          )}
        </Button>
      )}
      {viewHref ? (
        <Button asChild variant="outline" size="sm" className={BUTTON_CLASS}>
          <Link href={viewHref} aria-label={viewLabel}>
            <Eye aria-hidden className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          aria-label={viewLabel}
          onClick={onView}
          disabled={!onView}
          className={BUTTON_CLASS}
        >
          <Eye aria-hidden className="size-4" />
        </Button>
      )}
    </div>
  );
}
