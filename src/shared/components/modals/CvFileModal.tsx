'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

const PdfViewer = dynamic(() => import('@/shared/components/PdfViewer'), {
  ssr: false,
});

type CvFileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** The candidate's CV file (`cv` from the API). */
  pdfUrl?: string | null;
  /** Shows the "Download / Candidate Answers" footer (Figma 11791:116599) for job applicants. */
  onShowAnswers?: () => void;
};

// Shows a candidate's uploaded CV file (PDF) with a download link.
// `pr-6`: the dialog close button sits at the physical right in both directions.
export default function CvFileModal({
  open,
  onOpenChange,
  title,
  pdfUrl,
  onShowAnswers,
}: CvFileModalProps) {
  const t = useTranslations('common.cv-file');
  const pdfIcon = (
    <Image
      src="/assets/icons/pdf-icon.svg"
      width={14}
      height={14}
      alt={t('pdf-icon-alt')}
    />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mb-25 max-w-175 rounded-2xl p-8 text-center">
        <DialogHeader className="-mt-5 flex flex-row items-center justify-between gap-3 pr-6">
          <DialogTitle className="text-foreground text-xl font-bold">
            {title}
          </DialogTitle>
          {pdfUrl && !onShowAnswers ? (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="flex items-center gap-1.5 rounded-full px-4"
            >
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                {pdfIcon}
                {t('download')}
              </a>
            </Button>
          ) : null}
        </DialogHeader>

        {pdfUrl ? (
          <PdfViewer url={pdfUrl} />
        ) : (
          <p className="text-muted-foreground">{t('no-cv')}</p>
        )}

        {onShowAnswers ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {pdfUrl ? (
              <Button
                asChild
                className="bg-assessment-primary hover:bg-assessment-primary/90 h-10 gap-2 rounded-full px-6 text-sm font-normal"
              >
                <a href={pdfUrl} target="_blank" rel="noreferrer">
                  {pdfIcon}
                  {t('download')}
                </a>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={onShowAnswers}
              className="h-9.5 gap-2 rounded-full px-5 text-sm font-normal"
            >
              <Image
                src="/assets/icons/candidate-answers.svg"
                width={18}
                height={18}
                alt=""
                aria-hidden
              />
              {t('candidate-answers')}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
