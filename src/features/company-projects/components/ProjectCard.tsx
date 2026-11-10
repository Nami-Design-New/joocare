'use client';

import {
  ArrowUpRight,
  CheckCheck,
  CircleEllipsis,
  Folder,
  SquarePen,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import type { CompanyProject } from '../types/company-projects.types';
import ProjectShareIcon from './ProjectShareIcon';

type ProjectCardProps = {
  project: CompanyProject;
  onShare: () => void;
  onShowLog: () => void;
  onRename: () => void;
  onCloseProject: () => void;
  onDelete: () => void;
};

const avatarColors = [
  'bg-avatar-teal-bg text-avatar-teal',
  'bg-avatar-amber-bg text-avatar-amber',
  'bg-avatar-slate-bg text-avatar-slate',
  'bg-avatar-green-bg text-avatar-green',
];

const menuItemClassName = 'gap-3 px-3 py-2.5 text-base font-semibold';

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
    <Card className="bg-card gap-4 rounded-[24px] border-0 p-3 shadow-none">
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex items-start gap-3">
          <span className="bg-accent text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
            <Folder className="size-6" strokeWidth={1.67} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 className="text-foreground line-clamp-2 text-lg leading-[23px] font-semibold">
              {project.name}
            </h2>
            <p className="text-muted-foreground text-sm">{project.createdAt}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('project-actions', { name: project.name })}
                className="text-muted-foreground hover:text-foreground mt-3 shrink-0 rounded-full transition-colors"
              >
                <CircleEllipsis className="size-6" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-50 rounded-xl p-1"
            >
              <DropdownMenuItem
                onSelect={onRename}
                className={menuItemClassName}
              >
                <SquarePen className="size-5" /> {t('edit-name')}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.isClosed}
                onSelect={onCloseProject}
                className={menuItemClassName}
              >
                <CheckCheck className="size-5" /> {t('close-project')}
              </DropdownMenuItem>
              {shareCount > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenuItem
                        disabled
                        variant="destructive"
                        className={menuItemClassName}
                      >
                        <Trash2 className="size-5" /> {t('delete-project')}
                      </DropdownMenuItem>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t('shared-project-delete-tooltip')}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <DropdownMenuItem
                  onSelect={onDelete}
                  variant="destructive"
                  className={menuItemClassName}
                >
                  <Trash2 className="size-5" /> {t('delete-project')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="flex items-center gap-1.5 text-sm">
          <UserRound
            aria-hidden="true"
            className="text-secondary size-4 shrink-0"
            strokeWidth={1.5}
          />
          <span className="text-muted-foreground">{t('created-by')}</span>
          <span className="text-secondary truncate font-medium">
            {project.createdBy}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <div
            className="flex -space-x-2 rtl:space-x-reverse"
            aria-label={t('candidate-count', {
              count:
                project.additionalCandidates + project.candidateInitials.length,
            })}
          >
            {project.candidateInitials.map((initials, index) => (
              <span
                key={`${project.id}-${initials}-${index}`}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-xs',
                  avatarColors[index % avatarColors.length],
                )}
              >
                {initials}
              </span>
            ))}
          </div>
          <span className="text-gray-45 text-sm">
            +{project.additionalCandidates} {t('more')}
          </span>
        </div>

        <div className="border-border bg-body-bg flex min-h-[34px] items-center gap-2 rounded-xl border px-3 py-2 text-[13px] leading-4">
          <ProjectShareIcon className="text-primary size-4 shrink-0" />
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
        <Button
          asChild
          className="h-10 flex-1 gap-1.5 rounded-full text-base font-semibold"
        >
          <Link href={`/company/projects/${project.id}`}>
            {t('open-project')}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 rtl:-scale-x-100"
            />
          </Link>
        </Button>
        {project.isClosed ? (
          <span className="bg-destructive text-primary-foreground flex h-10 items-center rounded-full px-4 text-xs font-semibold">
            {t('closed')}
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t('share-project')}
            onClick={onShare}
            className="border-border bg-muted text-primary hover:bg-accent size-10 shrink-0 rounded-full"
          >
            <ProjectShareIcon className="size-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
