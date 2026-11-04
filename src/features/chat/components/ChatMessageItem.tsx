import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { ChatAttachment, ChatMessage } from '../types/chat.types';
import { formatChatDate } from '../utils/chat-format';
import ChatIcon from './ChatIcon';
import ChatAttachmentCard from './ChatAttachmentCard';
import ChatReplyPreview from './ChatReplyPreview';

type ChatMessageItemProps = {
  message: ChatMessage;
  avatar: string;
  closed: boolean;
  onReply: (message: ChatMessage) => void;
  onPreview: (attachment: ChatAttachment) => void;
  onDownload: (attachment: ChatAttachment) => void;
};

export default function ChatMessageItem({
  message,
  avatar,
  closed,
  onReply,
  onPreview,
  onDownload,
}: ChatMessageItemProps) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const outgoing = message.direction === 'outgoing';
  const hasImage = message.attachments?.some(
    (attachment) => attachment.kind === 'image',
  );
  return (
    <div
      className={cn(
        'group/message flex items-start gap-3',
        outgoing && 'justify-end',
      )}
    >
      {!outgoing && (
        <Image
          src={message.avatar ?? avatar}
          width={32}
          height={32}
          alt=""
          className={cn(
            'mt-1 size-8 shrink-0 rounded-full object-cover',
            hasImage && 'mt-0 self-center',
          )}
        />
      )}
      <div
        className={cn(
          'flex max-w-[calc(100%-2.75rem)] min-w-0 flex-col gap-1',
          outgoing ? 'max-w-[86%] items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'bg-chat-surface w-105 max-w-full space-y-3 rounded-2xl rounded-ss-none p-4',
            outgoing &&
              'bg-chat-primary text-primary-foreground w-108 rounded-ss-2xl rounded-se-none',
            hasImage && 'w-100',
          )}
        >
          {message.reply && (
            <ChatReplyPreview reply={message.reply} outgoing={outgoing} />
          )}
          {message.text && (
            <p
              dir="auto"
              className={cn(
                'text-start text-sm leading-4.5 wrap-anywhere whitespace-pre-wrap',
                message.fixedLines &&
                  'whitespace-normal md:whitespace-pre-wrap',
                message.fixedLines && outgoing && 'md:min-h-[91px]',
              )}
            >
              {message.text}
            </p>
          )}
          {message.attachments?.map((attachment) => (
            <ChatAttachmentCard
              key={attachment.id}
              attachment={attachment}
              onPreview={onPreview}
              onDownload={onDownload}
            />
          ))}
        </div>
        <time
          dateTime={message.sentAt}
          className="text-muted-foreground text-[10px] leading-3.25"
        >
          <bdi>{formatChatDate(message.sentAt, locale)}</bdi>
        </time>
      </div>
      {!closed && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className={cn(
            'mt-3 shrink-0 rounded-full opacity-70 hover:opacity-100 focus-visible:opacity-100 md:opacity-0 md:group-hover/message:opacity-100',
            hasImage &&
              'border-border mt-0 h-8 w-5 self-center rounded-full border opacity-100 md:opacity-100',
            outgoing && 'order-first',
          )}
          aria-label={t('reply-to-message')}
          onClick={() => onReply(message)}
        >
          <ChatIcon name="reply" width={16} />
        </Button>
      )}
    </div>
  );
}
