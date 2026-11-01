'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import {
  Ellipsis,
  Folder,
  CircleCheck,
  Pencil,
  Share2,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CompanyProject } from '../types/company-projects.types';

type ProjectCardProps = {
  project: CompanyProject;
  onShare: () => void;
  onShowLog: () => void;
  onRename: () => void;
  onCloseProject: () => void;
  onDelete: () => void;
};

const avatarColors = [
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-slate-100 text-slate-600',
  'bg-green-100 text-green-700',
];

export default function ProjectCard({
  project,
  onShare,
  onShowLog,
  onRename,
  onCloseProject,
  onDelete,
}: ProjectCardProps) {
  const t = useTranslations('companyPage.projects');
  const shareCount = project.shareLogs.length;
  const lastShare = project.shareLogs[0];

  return (
    <Card className="group bg-card hover:shadow-card gap-4 rounded-[24px] border-0 px-3 py-3 shadow-none transition-shadow sm:px-4">
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
            <Folder className="size-6" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-foreground line-clamp-2 min-h-6 text-base leading-6 font-semibold">
              {project.name}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {project.createdAt}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('project-actions', { name: project.name })}
                className="text-muted-foreground mt-1 rounded-full"
              >
                <Ellipsis className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onRename}>
                <Pencil /> {t('edit-name')}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.isClosed}
                onSelect={onCloseProject}
              >
                <CircleCheck /> {t('close-project')}
              </DropdownMenuItem>
              {shareCount > 0 ? (
                <DropdownMenuItem
                  disabled
                  className="text-destructive focus:text-destructive"
                >
                  <span
                    className="flex w-full items-center gap-2"
                    title={t('shared-project-delete-tooltip')}
                  >
                    <Trash2 /> {t('delete-project')}
                  </span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 /> {t('delete-project')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-foreground flex items-center gap-2 text-xs">
          <UserRound
            aria-hidden="true"
            className="text-secondary size-4 shrink-0"
          />
          <span>
            {t('created-by')}{' '}
            <strong className="font-semibold">{project.createdBy}</strong>
          </span>
        </p>

        <div className="flex min-h-8 items-center">
          <div
            className="flex -space-x-2"
            aria-label={t('candidate-count', {
              count:
                project.additionalCandidates + project.candidateInitials.length,
            })}
          >
            {project.candidateInitials.map((initials, index) => (
              <span
                key={`${project.id}-${initials}-${index}`}
                className={cn(
                  'border-card flex size-8 items-center justify-center rounded-full border-2 text-[10px] font-medium',
                  avatarColors[index % avatarColors.length],
                )}
              >
                {initials}
              </span>
            ))}
          </div>
          <span className="text-muted-foreground ms-2 text-xs">
            +{project.additionalCandidates} {t('more')}
          </span>
        </div>

        <div className="border-border bg-body-bg flex min-h-9 items-center gap-2 rounded-xl border px-3 text-xs">
          <Share2 className="text-primary size-4 shrink-0" />
          {shareCount ? (
            <>
              <span className="text-muted-foreground min-w-0 flex-1 truncate">
                {t('shared-count', { count: shareCount })} ·{' '}
                {t('last-shared', { date: lastShare?.date ?? '' })}
              </span>
              <button
                type="button"
                onClick={onShowLog}
                className="text-primary shrink-0 font-medium underline underline-offset-2"
              >
                {t('view-log')}
              </button>
            </>
          ) : (
            <span className="text-muted-foreground">{t('not-shared')}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 px-0 pt-0">
        <Button asChild className="h-10 flex-1 rounded-full font-semibold">
          <Link href={`/company/projects/${project.id}`}>
            {t('open-project')} <span aria-hidden="true">↗</span>
          </Link>
        </Button>
        {project.isClosed ? (
          <span className="bg-destructive flex h-10 items-center rounded-full px-4 text-xs font-semibold text-white">
            {t('closed')}
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t('share-project')}
            onClick={onShare}
            className="border-border bg-body-bg text-primary hover:bg-primary/10 size-10 rounded-full"
          >
            <Share2 className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
