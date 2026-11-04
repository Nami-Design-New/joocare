'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AI_JD_BUILDER_PREVIEW_MESSAGES } from '../constants';
import type { AiChatAttachment, AiChatMessage } from '../types/job-steps.types';
import type { JobFormData } from '../validation/job-post-schema';

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// AI JD Builder chat. Preview only: messages stay local until the AI endpoint exists.
export function useAiJdBuilder() {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const { getValues, setValue } = useFormContext<JobFormData>();
  const [messages, setMessages] = useState<AiChatMessage[]>(
    AI_JD_BUILDER_PREVIEW_MESSAGES,
  );
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<AiChatAttachment[]>([]);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const attach = (files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files).map((file): AiChatAttachment => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        kind: file.type.startsWith('image/') ? 'image' : 'file',
        url,
      };
    });
    setPending((current) => [...current, ...next]);
  };

  const send = () => {
    const text = draft.trim();
    if (!text && !pending.length) return;
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        author: 'user',
        sentAt: new Date().toISOString(),
        text,
        attachments: pending,
      },
    ]);
    setDraft('');
    setPending([]);
  };

  return {
    messages,
    draft,
    setDraft,
    pending,
    attach,
    removePending: (id: string) =>
      setPending((current) => current.filter((item) => item.id !== id)),
    send,
    edit: (message: AiChatMessage) => setDraft(message.text),
    copy: async (message: AiChatMessage) => {
      try {
        await navigator.clipboard.writeText(message.text);
        toast.success(t('copied-toast'));
      } catch {
        toast.error(t('copy-failed'));
      }
    },
    // Adds the suggestion to the end of the job description.
    apply: (suggestion: string) => {
      const description = getValues('description') ?? '';
      setValue(
        'description',
        `${description}<p>${escapeHtml(suggestion)}</p>`,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
      toast.success(t('applied-toast'));
    },
  };
}

export type AiJdBuilderState = ReturnType<typeof useAiJdBuilder>;
