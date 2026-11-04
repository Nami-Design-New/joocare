'use client';

import { useRef } from 'react';
import { ArrowUp, Link2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { AI_CHAT_ACCEPTED_FILES } from '../../../constants';
import type { AiJdBuilderState } from '../../../hooks/useAiJdBuilder';

type AiChatInputProps = {
  chat: AiJdBuilderState;
};

// "Ask anything" box with attach + send (Figma 10086:87646).
export default function AiChatInput({ chat }: AiChatInputProps) {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const fileInput = useRef<HTMLInputElement>(null);
  const canSend = Boolean(chat.draft.trim() || chat.pending.length);

  return (
    <div className="bg-card/80 border-border flex flex-col gap-3 rounded-3xl border p-3">
      {chat.pending.length ? (
        <ul className="flex flex-wrap gap-2">
          {chat.pending.map((file) => (
            <li
              key={file.id}
              className="bg-muted flex items-center gap-1 rounded-full py-1 ps-3 pe-1 text-xs"
            >
              <span className="max-w-40 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => chat.removePending(file.id)}
                aria-label={t('remove-attachment', { name: file.name })}
                className="rounded-full p-0.5"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <textarea
        rows={1}
        value={chat.draft}
        onChange={(event) => chat.setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            chat.send();
          }
        }}
        aria-label={t('ask-placeholder')}
        placeholder={t('ask-placeholder')}
        className="placeholder:text-foreground/45 max-h-40 resize-none bg-transparent px-2 py-1 text-sm outline-none"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label={t('attach')}
          className="hover:bg-muted rounded-full p-1"
        >
          <Link2 aria-hidden="true" className="size-5 -rotate-45" />
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={AI_CHAT_ACCEPTED_FILES}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            chat.attach(event.target.files);
            event.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={chat.send}
          disabled={!canSend}
          aria-label={t('send')}
          className={cn(
            'flex size-7 items-center justify-center rounded-full transition-colors',
            canSend
              ? 'bg-primary text-primary-foreground'
              : 'bg-foreground/35 text-foreground/65',
          )}
        >
          <ArrowUp aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
