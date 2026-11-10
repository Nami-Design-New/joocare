'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAiJdBuilder } from '../../../hooks/useAiJdBuilder';
import AiChatInput from './AiChatInput';
import AiChatMessageItem from './AiChatMessageItem';

type AiJdBuilderPanelProps = {
  onClose: () => void;
};

// AI JD Builder side panel next to the step-2 form (Figma 10086:87585).
export default function AiJdBuilderPanel({ onClose }: AiJdBuilderPanelProps) {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const chat = useAiJdBuilder();
  const listEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEnd.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [chat.messages.length]);

  return (
    <aside
      aria-label={t('panel-title')}
      className="bg-body-bg rounded-3xl p-1 lg:sticky lg:top-24 lg:self-start"
    >
      <div className="bg-card flex max-h-[calc(100dvh-8rem)] min-h-125 flex-col gap-8 rounded-3xl px-4 py-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary-bg text-primary flex size-10 items-center justify-center rounded-xl">
              <Sparkles aria-hidden="true" className="size-5.5" />
            </span>
            <h2 className="text-primary text-xl font-semibold sm:text-[21px]">
              {t('panel-title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close-panel')}
            className="bg-muted border-border hover:bg-muted/70 flex size-12 items-center justify-center rounded-full border"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>
        <div
          className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto"
          aria-live="polite"
        >
          {chat.messages.map((message) => (
            <AiChatMessageItem
              key={message.id}
              message={message}
              onCopy={chat.copy}
              onEdit={chat.edit}
              onApply={chat.apply}
            />
          ))}
          <div ref={listEnd} />
        </div>
        <AiChatInput chat={chat} />
      </div>
    </aside>
  );
}
