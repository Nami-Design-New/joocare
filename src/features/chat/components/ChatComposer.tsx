import Image from 'next/image';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { TextareaField } from '@/shared/components/TextareaField';
import { CHAT_ATTACHMENT_ACCEPT } from '../constants';
import { useChatComposer } from '../hooks/useChatComposer';
import type {
  ChatAttachment,
  ChatMessage,
  SendChatMessage,
} from '../types/chat.types';
import ChatIcon from './ChatIcon';

type ChatComposerProps = {
  name: string;
  replyMessage: ChatMessage | null;
  onSend: (message: SendChatMessage) => void;
  onCancelReply: () => void;
  createObjectUrl: (file: File) => string;
  initialAttachments?: ChatAttachment[];
};

export default function ChatComposer(props: ChatComposerProps) {
  const t = useTranslations('companyPage.chat');
  const {
    form,
    fileInput,
    attachments,
    reply,
    addFiles,
    openFilePicker,
    removeAttachment,
    submit,
    canSend,
  } = useChatComposer(props);
  const expanded = Boolean(reply || attachments.length);
  return (
    <form
      onSubmit={submit}
      aria-label={t('message-composer')}
      className="space-y-3"
    >
      <Controller
        name="attachments"
        control={form.control}
        render={({ field }) => (
          <input
            ref={fileInput}
            name={field.name}
            onBlur={field.onBlur}
            type="file"
            multiple
            accept={CHAT_ATTACHMENT_ACCEPT}
            className="hidden"
            aria-label={t('attach-files')}
            onChange={(event) => addFiles(event.target.files)}
          />
        )}
      />
      {reply && (
        <div className="relative flex items-center gap-2 rounded-xl bg-chat-surface px-3 py-2 before:absolute before:start-3 before:top-2 before:h-8 before:w-[3px] before:bg-chat-primary">
          <div className="min-w-0 flex-1 ps-3">
            <p className="truncate text-xs leading-4 font-semibold text-chat-primary">
              {t('replying-to', { name: reply.name })}
            </p>
            <p className="mt-0.5 truncate text-xs leading-4 text-muted-foreground">
              {reply.text}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={props.onCancelReply}
            aria-label={t('cancel-reply')}
          >
            <ChatIcon name="cancel-reply" width={16} />
          </Button>
        </div>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative flex size-16 items-center justify-center rounded-xl border border-border bg-card"
            >
              {attachment.kind === 'image' && attachment.url ? (
                <Image
                  src={attachment.url}
                  width={64}
                  height={64}
                  alt={attachment.name}
                  unoptimized
                  className="size-full rounded-xl object-cover"
                />
              ) : (
                <ChatIcon name="file" width={22} height={28} />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute -end-1 -top-1 size-5 rounded-full p-0"
                onClick={() => removeAttachment(attachment.id)}
                aria-label={t('remove-attachment', { name: attachment.name })}
              >
                <ChatIcon name="remove-attachment" width={20} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="size-16 rounded-xl border border-dashed border-chat-dashed"
            onClick={() => openFilePicker()}
            aria-label={t('add-more-files')}
          >
            <ChatIcon name="add" />
          </Button>
        </div>
      )}
      <div className="flex items-end gap-3 rounded-2xl border border-border bg-chat-surface px-3 py-[11px]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8.5 w-7 shrink-0 rounded-lg"
          aria-label={t('attach-files')}
          onClick={() => openFilePicker()}
        >
          <ChatIcon name="attach" width={13} height={20} />
        </Button>
        {expanded && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8.5 w-5"
            aria-label={t('attach-images')}
            onClick={() => openFilePicker(true)}
          >
            <ChatIcon name="image" />
          </Button>
        )}
        <TextareaField
          {...form.register('text')}
          id="chat-message"
          aria-label={t('message')}
          rows={1}
          placeholder={
            expanded
              ? t('caption-placeholder')
              : t('message-placeholder', { name: props.name })
          }
          error={form.formState.errors.text?.message}
          containerStyles="min-w-0 flex-1"
          className="field-sizing-content max-h-36 min-h-8.5 resize-none rounded-none border-0 bg-transparent px-0 py-2 text-sm leading-4.5 shadow-none placeholder:text-chat-search focus-visible:ring-0"
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              if (canSend) void submit();
            }
          }}
        />
        <Button
          type="submit"
          disabled={!canSend}
          className="h-8.5 w-9 rounded-xl bg-chat-primary p-0 disabled:opacity-60"
          aria-label={t('send-message')}
        >
          <ChatIcon
            name="send"
            width={16}
            height={14}
            className="rtl:-scale-x-100"
          />
        </Button>
      </div>
    </form>
  );
}
