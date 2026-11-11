'use client';

import Image from 'next/image';
import { Copy, Download, FileText, PencilLine, Sparkles } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type {
  AiChatAttachment,
  AiChatMessage,
} from '../../../types/job-steps.types';

type AiChatMessageItemProps = {
  message: AiChatMessage;
  onCopy: (message: AiChatMessage) => void;
  onEdit: (message: AiChatMessage) => void;
  onApply: (suggestion: string) => void;
};

const KB = 1024;

export default function AiChatMessageItem({
  message,
  onCopy,
  onEdit,
  onApply,
}: AiChatMessageItemProps) {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const format = useFormatter();
  const isUser = message.author === 'user';
  const sentAt = new Date(message.sentAt);
  const meta = [
    t(isUser ? 'you-label' : 'ai-label'),
    format.dateTime(sentAt, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    format.dateTime(sentAt, { hour: 'numeric', minute: '2-digit' }),
  ].join(' · ');

  return (
    <article className="flex flex-col gap-2">
      <p className="text-xs text-foreground/45">{meta}</p>
      <div
        className={cn(
          'flex flex-col gap-2 text-base',
          isUser ? 'max-w-[90%] rounded-2xl bg-muted px-5 py-3' : 'pb-3',
        )}
      >
        {message.text ? (
          <p className="whitespace-pre-line text-foreground">{message.text}</p>
        ) : null}
        {message.attachments?.map((attachment) => (
          <AttachmentView key={attachment.id} attachment={attachment} />
        ))}
      </div>
      {message.insight ? (
        <section className="flex flex-col gap-2 rounded-2xl bg-muted p-2">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-base text-foreground">{t('insight-title')}</h3>
          </div>
          <p className="rounded-xl bg-card p-2 text-sm font-light text-foreground">
            {message.insight.suggestion}
          </p>
          <p className="text-[11px] font-light text-foreground/45">
            {message.insight.note}
          </p>
          <Button
            type="button"
            onClick={() =>
              message.insight && onApply(message.insight.suggestion)
            }
            className="h-8 rounded-xl text-sm font-normal"
          >
            {t('apply')}
          </Button>
        </section>
      ) : null}
      {isUser && message.text ? (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onCopy(message)}
            aria-label={t('copy')}
            className="rounded p-0.5"
          >
            <Copy aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(message)}
            aria-label={t('edit')}
            className="rounded p-0.5"
          >
            <PencilLine aria-hidden="true" className="size-5" />
          </button>
        </div>
      ) : null}
    </article>
  );
}

function AttachmentView({ attachment }: { attachment: AiChatAttachment }) {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const size = t('file-size', {
    size: Math.max(1, Math.round(attachment.size / KB)),
  });

  if (attachment.kind === 'image' && attachment.url) {
    return (
      <figure className="flex flex-col gap-1">
        <Image
          src={attachment.url}
          alt={attachment.name}
          width={361}
          height={110}
          unoptimized
          className="h-28 w-full rounded-xl object-cover"
        />
        <figcaption className="text-[11px] text-muted-foreground">
          {attachment.name} · {size}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3">
      <FileText aria-hidden="true" className="size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{attachment.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {size} • {attachment.name.split('.').pop()?.toUpperCase()}
        </p>
      </div>
      {attachment.url ? (
        <a
          href={attachment.url}
          download={attachment.name}
          aria-label={t('download-file', { name: attachment.name })}
          className="rounded p-1 text-primary"
        >
          <Download aria-hidden="true" className="size-4" />
        </a>
      ) : null}
    </div>
  );
}
