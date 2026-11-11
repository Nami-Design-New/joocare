'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { isPreviewableCvFileName } from '../validation/cv-schema';

// pdf.js needs browser APIs (DOMMatrix), so it must not load during server rendering.
const PdfViewer = dynamic(() => import('@/shared/components/PdfViewer'), {
  ssr: false,
});

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url?: string;
  fileName: string;
  handleDownload: () => void;
  handleUploadClick: () => void;
  handleDelete: () => void;
  isDeleting?: boolean;
  isUploading?: boolean;
};
export default function CVModal({
  open,
  onOpenChange,
  title,
  url,
  fileName,
  handleDownload,
  handleUploadClick,
  isDeleting = false,
  isUploading = false,
}: ConfirmDialogProps) {
  const t = useTranslations();
  const canPreview = isPreviewableCvFileName(fileName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mb-25 w-[calc(100vw-1rem)] max-w-175 rounded-2xl p-5 text-center sm:max-w-175 sm:p-8">
        <DialogHeader className="-mt-5 flex flex-row items-center justify-between pe-2">
          <DialogTitle className="text-xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full px-4"
            onClick={() => handleDownload()}
          >
            <Image
              src="/assets/icons/pdf-icon.svg"
              width={14}
              height={14}
              alt={t('candidatePage.profile.pdf-icon')}
            />
            {t('candidatePage.common.download')}
          </Button>
        </DialogHeader>

        {canPreview && url ? (
          <PdfViewer url={url} fileName={fileName} />
        ) : (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            {t('candidatePage.profile.pdf-preview-only')}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {/* <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-1.5 rounded-full px-4 h-10"
            onClick={() => handleDelete()}
            disabled={isDeleting || isUploading}
          >
            <Trash className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button> */}
          <Button
            size="sm"
            variant="default"
            className="flex h-10 items-center gap-1.5 rounded-full px-4"
            onClick={() => handleUploadClick()}
            disabled={isUploading || isDeleting}
          >
            <RefreshCw className="h-4 w-4" />
            {isUploading
              ? t('candidatePage.common.updating')
              : t('candidatePage.common.update')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
