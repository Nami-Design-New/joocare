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
};

// Shows a candidate's uploaded CV file (PDF) with a download link.
// `pr-6`: the dialog close button sits at the physical right in both directions.
export default function CvFileModal({
  open,
  onOpenChange,
  title,
  pdfUrl,
}: CvFileModalProps) {
  const t = useTranslations('common.cv-file');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mb-25 max-w-175 rounded-2xl p-8 text-center">
        <DialogHeader className="-mt-5 flex flex-row items-center justify-between gap-3 pr-6">
          <DialogTitle className="text-foreground text-xl font-bold">
            {title}
          </DialogTitle>
          {pdfUrl ? (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="flex items-center gap-1.5 rounded-full px-4"
            >
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/icons/pdf-icon.svg"
                  width={14}
                  height={14}
                  alt={t('pdf-icon-alt')}
                />
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
      </DialogContent>
    </Dialog>
  );
}
