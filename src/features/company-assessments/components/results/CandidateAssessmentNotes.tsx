'use client';

import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { TextareaField } from '@/shared/components/TextareaField';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAssessmentNotes } from '../../hooks/useAssessmentNotes';

export default function CandidateAssessmentNotes() {
  const t = useTranslations('companyPage.assessments.answers');
  const format = useFormatter();
  const notes = useAssessmentNotes();

  return (
    <Card className="gap-4 rounded-2xl border-0 p-6 shadow-none">
      <header className="space-y-1">
        <h2 className="text-assessment-main text-lg leading-6 font-semibold">
          {t('notes-title', { count: notes.notes.length })}
        </h2>
        <p className="text-assessment-muted text-[13px] leading-4">
          {t('notes-description')}
        </p>
      </header>
      <form
        onSubmit={notes.saveNote}
        className="flex flex-col items-end gap-3 sm:flex-row"
      >
        <TextareaField
          id="assessment-note"
          aria-label={t('note-label')}
          placeholder={t('note-placeholder')}
          className="border-assessment-border min-h-19 resize-y rounded-2xl px-4 py-3.5 text-sm shadow-none"
          {...notes.form.register('text')}
          error={notes.form.formState.errors.text?.message}
        />
        <div className="flex shrink-0 gap-2">
          {notes.editingId ? (
            <Button
              type="button"
              variant="ghost"
              size="pill"
              onClick={notes.cancelEdit}
            >
              {t('cancel')}
            </Button>
          ) : null}
          <Button
            type="submit"
            size="pill"
            className="bg-assessment-primary h-12.5 px-8 text-sm font-semibold"
            disabled={notes.form.formState.isSubmitting}
          >
            {t(notes.editingId ? 'save-note' : 'add-note')}
          </Button>
        </div>
      </form>
      <div className="space-y-3" aria-live="polite">
        {!notes.notes.length ? (
          <p className="text-assessment-muted text-sm">{t('no-notes')}</p>
        ) : null}
        {notes.notes.map((note) => (
          <article
            key={note.id}
            className="bg-body-bg flex items-start gap-3 rounded-2xl p-4"
          >
            <span className="bg-assessment-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {note.initials}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                <h3 className="text-assessment-main text-sm leading-4.5 font-semibold">
                  {note.author}
                </h3>
                <p className="text-assessment-muted text-xs">
                  {note.role} ·{' '}
                  {format.dateTime(new Date(note.createdAt), {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'UTC',
                  })}
                  {note.edited ? ` · ${t('edited')}` : ''}
                </p>
              </div>
              <p className="text-assessment-main text-sm leading-4.5 break-words whitespace-pre-wrap">
                {note.text}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-assessment-muted rounded-full border border-current"
                  aria-label={t('note-actions', { name: note.author })}
                >
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-48 rounded-lg p-3"
              >
                <DropdownMenuItem onSelect={() => notes.editNote(note)}>
                  <Pencil className="size-4" />
                  {t('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => notes.deleteNote(note.id)}
                >
                  <Trash2 className="size-4" />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </article>
        ))}
      </div>
    </Card>
  );
}
