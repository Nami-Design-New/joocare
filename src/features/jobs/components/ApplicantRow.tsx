'use client';

import { Button } from '@/shared/components/ui/button';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { Eye, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { Applicant } from '../types/index.types';
import { useTranslations } from 'next-intl';

export default function ApplicantRow({
  applicant,
  onDownload,
  onView,
  index,
  isDownloading = false,
  currentPage = 1,
}: {
  applicant: Applicant;
  onDownload?: (a: Applicant) => void | Promise<void>;
  onView?: (a: Applicant) => void;
  index: number;
  isDownloading?: boolean;
  currentPage?: number;
}) {
  const t = useTranslations();
  console.log('applic', applicant);

  return (
    <TableRow className="border-b border-border bg-white transition-colors odd:bg-muted">
      <TableCell className="w-12 px-4 py-5 font-medium text-muted-foreground">
        {10 * (currentPage - 1) + index + 1}
      </TableCell>
      <TableCell className="px-4 py-5 text-base font-normal text-foreground">
        {applicant.name}
      </TableCell>
      <TableCell className="px-4 py-5 text-base font-normal text-foreground">
        {applicant.email}
      </TableCell>
      <TableCell className="px-4 py-5 text-base font-normal text-foreground">
        {applicant.phone !== 'null null' ? applicant.phone : '-'}
      </TableCell>
      <TableCell className="px-4 py-5 text-sm text-muted-foreground">
        {applicant.date}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 px-4 md:gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full px-2 md:px-4"
            disabled={isDownloading || !applicant.cvUrl}
            onClick={() => onDownload?.(applicant)}
          >
            {isDownloading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Image
                src="/assets/icons/pdf-icon.svg"
                width={14}
                height={14}
                alt={t('companyPage.candidates.pdf-icon-alt')}
              />
            )}
            {isDownloading
              ? t('companyPage.candidates.actions.downloading')
              : t('companyPage.candidates.actions.download')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1.5 rounded-full border-secondary px-2 text-secondary md:px-4"
            onClick={() => onView?.(applicant)}
          >
            <Eye className="h-4 w-4" />
            {t('common.view')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
