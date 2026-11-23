'use client';

import { useEffect, useRef, useState, type UIEvent } from 'react';
import { Check, Folder, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import SearchInput from '@/shared/components/SearchInput';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
} from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { PROJECT_SEARCH_DEBOUNCE_MS } from '../../constants/project-queries';
import { useGetProjectOptions } from '../../hooks/useGetProjectOptions';
import type { ProjectCandidateRef } from '../../types/company-projects.types';
import ProjectModalHeader from './ProjectModalHeader';

type AddCandidateToProjectModalProps = {
  candidate: ProjectCandidateRef;
  onClose: () => void;
  onSubmit: (projectIds: string[]) => Promise<void>;
};

export default function AddCandidateToProjectModal({
  candidate,
  onClose,
  onSubmit,
}: AddCandidateToProjectModalProps) {
  const t = useTranslations('companyPage.projects.candidate-projects');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Blocks a second click before `isSubmitting` re-renders.
  const inFlight = useRef(false);
  const options = useGetProjectOptions(debouncedSearch);
  const visibleProjects = options.projects;

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      PROJECT_SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  // Loads the next page when the list is scrolled near its end.
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const list = event.currentTarget;
    const nearEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 48;
    if (nearEnd && options.hasNextPage && !options.isFetchingNextPage) {
      void options.fetchNextPage();
    }
  };

  const toggleProject = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const submit = async () => {
    if (inFlight.current || !selectedIds.length) return;
    inFlight.current = true;
    setIsSubmitting(true);
    try {
      await onSubmit(selectedIds);
    } catch {
      // The mutation hook shows the error; keep the selection to retry.
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <ModalContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-200 gap-6 rounded-3xl border-0 bg-card p-6 sm:min-w-0"
      >
        <ProjectModalHeader title={t('link-title')} disabled={isSubmitting} />
        <ModalDescription className="sr-only">
          {t('link-description', { name: candidate.name })}
        </ModalDescription>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('search-projects')}
          containerClassName="border-border border-b pb-4"
          className="border border-border bg-card"
        />
        <div
          role="group"
          aria-label={t('projects-list')}
          aria-busy={options.isFetching}
          onScroll={handleScroll}
          className="flex max-h-[45vh] flex-col gap-3 overflow-y-auto"
        >
          {options.isError && !options.data ? (
            <div role="alert" className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-muted-foreground">
                {t('projects-load-error')}
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void options.refetch()}
              >
                {t('retry')}
              </Button>
            </div>
          ) : !options.data ? (
            Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-17 rounded-xl" />
            ))
          ) : visibleProjects.length ? (
            visibleProjects.map((project) => {
              const isSelected = selectedIds.includes(project.id);
              return (
                <button
                  key={project.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  disabled={isSubmitting}
                  onClick={() => toggleProject(project.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-start transition-colors',
                    isSelected
                      ? 'border-primary bg-primary-bg'
                      : 'hover:bg-muted/50',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted',
                    )}
                  >
                    {isSelected && <Check className="size-3.5" />}
                  </span>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary">
                    <Folder aria-hidden className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-semibold">
                      {project.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {/* `#`: project candidate counts have no API yet. */}
                      {t('candidates-count', {
                        count: project.candidateCount ?? '#',
                      })}
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <EmptyDataState
              title="companyPage.projects.candidate-projects.no-projects-title"
              description={t('no-projects-description')}
              className="min-h-60 py-6"
            />
          )}
          {options.isFetchingNextPage ? (
            <LoaderCircle
              aria-hidden
              className="mx-auto size-5 animate-spin text-primary"
            />
          ) : null}
        </div>
        <Button
          type="button"
          size="pill"
          disabled={!selectedIds.length || isSubmitting}
          onClick={() => void submit()}
        >
          {isSubmitting && (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          )}
          {t(isSubmitting ? 'adding' : 'link-submit')}
        </Button>
      </ModalContent>
    </Modal>
  );
}
