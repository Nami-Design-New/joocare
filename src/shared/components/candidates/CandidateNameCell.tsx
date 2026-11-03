'use client';

import Image from 'next/image';
import { ChevronDown, FolderPlus, Link as LinkIcon, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

type CandidateNameCellProps = {
  name: string;
  image: string;
  href?: string;
  isStarred: boolean;
  onToggleStar: () => void;
  onCreateProject: () => void;
  onLinkProject: () => void;
};

const NAME_CLASS = 'min-w-0 flex-1 truncate underline underline-offset-2';

export default function CandidateNameCell({
  name,
  image,
  href,
  isStarred,
  onToggleStar,
  onCreateProject,
  onLinkProject,
}: CandidateNameCellProps) {
  const t = useTranslations('common.candidate-row');

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Image
        src={image}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover"
      />
      {href ? (
        <Link href={href} className={NAME_CLASS} title={name}>
          {name}
        </Link>
      ) : (
        <span className={NAME_CLASS} title={name}>
          {name}
        </span>
      )}
      <button
        type="button"
        aria-label={t('favorite', { name })}
        aria-pressed={isStarred}
        onClick={onToggleStar}
        className="shrink-0 rounded p-0.5 focus-visible:outline-2"
      >
        <Star
          className={cn(
            'text-muted-foreground size-6',
            isStarred && 'text-warning fill-warning',
          )}
        />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={t('candidate-actions', { name })}
            className="group bg-muted text-muted-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground size-6 rounded-full p-0"
          >
            <ChevronDown
              aria-hidden
              className="size-4 transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40 rounded-xl">
          <DropdownMenuItem onSelect={onCreateProject}>
            <FolderPlus aria-hidden className="size-4" />
            {t('create-project')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onLinkProject}>
            <LinkIcon aria-hidden className="size-4" />
            {t('link-project')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
