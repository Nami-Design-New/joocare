'use client';

import { useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  CHAT_ACCEPTED_TYPES,
  CHAT_ATTACHMENT_ACCEPT,
  CHAT_IMAGE_ACCEPT,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
} from '../constants';
import {
  createChatMessageSchema,
  type ChatMessageFormValues,
} from '../validation/chat-message-schema';
import { formatChatFileSize } from '../utils/chat-format';
import type {
  ChatMessage,
  ChatAttachment,
  ChatReply,
  SendChatMessage,
} from '../types/chat.types';

type UseChatComposerOptions = {
  name: string;
  replyMessage: ChatMessage | null;
  onSend: (message: SendChatMessage) => void;
  onCancelReply: () => void;
  createObjectUrl: (file: File) => string;
  initialAttachments?: ChatAttachment[];
};

export function useChatComposer({
  name,
  replyMessage,
  onSend,
  onCancelReply,
  createObjectUrl,
  initialAttachments = [],
}: UseChatComposerOptions) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const schema = useMemo(
    () => createChatMessageSchema({ tooLong: t('message-too-long') }),
    [t],
  );
  const form = useForm<ChatMessageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: '', attachments: initialAttachments },
    mode: 'onChange',
  });
  const text = useWatch({ control: form.control, name: 'text' });
  const attachments = useWatch({ control: form.control, name: 'attachments' });
  const { isValid, isSubmitting } = form.formState;
  const fileInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const reply: ChatReply | undefined = replyMessage
    ? {
        name: replyMessage.direction === 'incoming' ? name : t('you'),
        text: replyMessage.text,
        image: replyMessage.attachments?.find((item) => item.kind === 'image')
          ?.url,
      }
    : undefined;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const selectedFiles = Array.from(files);
    if (attachments.length + selectedFiles.length > MAX_ATTACHMENTS) {
      toast.error(t('too-many-files', { count: MAX_ATTACHMENTS }));
      return;
    }
    if (
      selectedFiles.some(
        (file) =>
          file.size > MAX_ATTACHMENT_BYTES ||
          !CHAT_ACCEPTED_TYPES.includes(file.type),
      )
    ) {
      toast.error(t('invalid-file'));
      return;
    }
    const newAttachments = selectedFiles.map((file) => {
      const url = createObjectUrl(file);
      return {
        id: crypto.randomUUID(),
        name: file.name,
        kind: file.type.startsWith('image/')
          ? ('image' as const)
          : ('file' as const),
        size: formatChatFileSize(file.size, locale),
        url,
      };
    });
    form.setValue('attachments', [...attachments, ...newAttachments], {
      shouldValidate: true,
    });
    if (fileInput.current) fileInput.current.value = '';
  }

  function openFilePicker(imagesOnly = false) {
    if (!fileInput.current) return;
    fileInput.current.accept = imagesOnly
      ? CHAT_IMAGE_ACCEPT
      : CHAT_ATTACHMENT_ACCEPT;
    fileInput.current.click();
  }

  function removeAttachment(id: string) {
    const attachment = attachments.find((item) => item.id === id);
    if (attachment?.url?.startsWith('blob:'))
      URL.revokeObjectURL(attachment.url);
    form.setValue(
      'attachments',
      attachments.filter((item) => item.id !== id),
      { shouldValidate: true },
    );
  }

  const submit = form.handleSubmit((value) => {
    if (submitting.current || (!value.text.trim() && attachments.length === 0))
      return;
    submitting.current = true;
    try {
      onSend({ text: value.text, attachments, reply });
      form.reset({ text: '', attachments: [] });
      onCancelReply();
    } finally {
      submitting.current = false;
    }
  });

  return {
    form,
    fileInput,
    attachments,
    reply,
    addFiles,
    openFilePicker,
    removeAttachment,
    submit,
    canSend:
      Boolean(text?.trim() || attachments.length) && isValid && !isSubmitting,
  };
}
