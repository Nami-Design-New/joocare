'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  ChevronDown,
  Eye,
  FileText,
  FolderPlus,
  Link as LinkIcon,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import type { TalentCandidate } from '../types/talent-database.types';

type TalentCandidatesTableProps = {
  candidates: TalentCandidate[];
  selectedIds: string[];
  pageOffset: number;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onMessage: (id: string) => void;
};

export default function TalentCandidatesTable({
  candidates,
  selectedIds,
  pageOffset,
  onToggle,
  onToggleAll,
  onMessage,
}: TalentCandidatesTableProps) {
  const t = useTranslations('companyPage.talent-database');
  const [favorites, setFavorites] = useState<string[]>([]);
  const selectedOnPage = candidates.filter((candidate) =>
    selectedIds.includes(candidate.id),
  ).length;
  const columns: DataTableColumn<TalentCandidate>[] = [
    {
      id: 'selection',
      header: (
        <div className="flex items-center gap-2">
          <Checkbox
            aria-label={t('select-all')}
            checked={
              selectedOnPage === candidates.length && candidates.length > 0
                ? true
                : selectedOnPage
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={onToggleAll}
            className="border-primary-foreground bg-card size-6 rounded-[3px]"
          />
          <span>#</span>
        </div>
      ),
      headerClassName: 'w-[9%] text-start',
      cellClassName: 'w-[9%] px-4 text-start',
      renderCell: (candidate, index) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.includes(candidate.id)}
            onCheckedChange={() => onToggle(candidate.id)}
            aria-label={t('select-candidate', { name: candidate.name })}
            className="size-6 rounded-[3px]"
          />
          <span>{pageOffset + index + 1}</span>
        </div>
      ),
    },
    {
      id: 'name',
      header: t('name'),
      headerClassName: 'w-[18%] text-start',
      cellClassName: 'w-[18%] text-start',
      renderCell: (candidate) => (
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={candidate.image}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <Link
            href={`/company/candidate-profile?candidateId=${candidate.id}&source=talent-database`}
            className="min-w-0 max-w-[70px] truncate underline underline-offset-2"
            title={candidate.name}
          >
            {candidate.name}
          </Link>
          <button
            type="button"
            aria-label={t('favorite', { name: candidate.name })}
            aria-pressed={favorites.includes(candidate.id)}
            onClick={() =>
              setFavorites((current) =>
                current.includes(candidate.id)
                  ? current.filter((id) => id !== candidate.id)
                  : [...current, candidate.id],
              )
            }
            className="shrink-0 rounded p-0.5 focus-visible:outline-2"
          >
            <Star
              className={cn(
                'text-muted-foreground size-6',
                favorites.includes(candidate.id) &&
                  'text-warning fill-warning',
              )}
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t('candidate-actions', { name: candidate.name })}
                className="group size-6 rounded-full bg-muted p-0 text-muted-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground"
              >
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform group-data-[state=open]:rotate-180"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40 rounded-xl">
              <DropdownMenuItem>
                <FolderPlus aria-hidden className="size-4" />
                {t('create-project')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LinkIcon aria-hidden className="size-4" />
                {t('link-project')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      id: 'nationality',
      header: t('fields.nationality'),
      headerClassName: 'w-[14%]',
      cellClassName: 'w-[14%]',
      renderCell: (candidate) =>
        t(`options.${candidate.attributes.nationality}`),
    },
    {
      id: 'email',
      header: t('email'),
      headerClassName: 'w-[14%]',
      cellClassName: 'w-[14%]',
      renderCell: (candidate) => (
        <bdi className="block max-w-40 truncate" title={candidate.email}>
          {candidate.email}
        </bdi>
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      headerClassName: 'w-[13%]',
      cellClassName: 'w-[13%]',
      renderCell: (candidate) => (
        <bdi className="whitespace-nowrap">{candidate.phone}</bdi>
      ),
    },
    {
      id: 'score',
      header: t('ai-score'),
      headerClassName: 'w-[12%]',
      cellClassName: 'w-[12%]',
      renderCell: (candidate) => (
        <span className="border-primary text-primary mx-auto flex size-12 items-center justify-center rounded-full border-2 text-sm">
          {candidate.score}%
        </span>
      ),
    },
    {
      id: 'cv',
      header: t('cv'),
      headerClassName: 'w-[20%]',
      cellClassName: 'w-[20%]',
      renderCell: (candidate) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="sm"
            aria-label={t('message-candidate', { name: candidate.name })}
            onClick={() => onMessage(candidate.id)}
            className="h-8 w-16 rounded-full p-0"
          >
            <MessageSquare aria-hidden className="size-4" />
          </Button>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="h-8 w-16 min-w-0 rounded-full p-0"
          >
            <a
              href={candidate.cv}
              download={`${candidate.name} CV.pdf`}
              aria-label={t('download-cv', { name: candidate.name })}
            >
              <FileText aria-hidden className="size-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 w-16 rounded-full p-0"
          >
            <Link
              href={`/company/candidate-profile?candidateId=${candidate.id}&source=talent-database`}
              aria-label={t('view-profile', { name: candidate.name })}
            >
              <Eye aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-card rounded-2xl p-3">
      <DataTable
        columns={columns}
        data={candidates}
        getRowKey={(candidate) => candidate.id}
        ariaLabel={t('results-table')}
        className="min-w-[1028px] table-fixed"
        headerRowClassName="bg-primary hover:bg-primary [&_th]:text-primary-foreground"
        rowClassName="bg-body-bg h-[92px] border-border"
      />
    </div>
  );
}
