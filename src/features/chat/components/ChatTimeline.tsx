import { Fragment, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import EmptyDataState from '@/shared/components/EmptyDataState';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
} from '../types/chat.types';
import { formatChatDate } from '../utils/chat-format';
import ChatIcon from './ChatIcon';
import ChatMessageItem from './ChatMessageItem';

type ChatTimelineProps = {
  mobileConversationOpen: boolean;
  conversation: ChatConversation;
  onReply: (message: ChatMessage) => void;
  onPreview: (attachment: ChatAttachment) => void;
  onDownload: (attachment: ChatAttachment) => void;
};

export default function ChatTimeline({
  mobileConversationOpen,
  conversation,
  onReply,
  onPreview,
  onDownload,
}: ChatTimelineProps) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const scrollArea = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const area = scrollArea.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, [
    conversation.id,
    conversation.messages.length,
    conversation.closedAt,
    mobileConversationOpen,
  ]);
  return (
    <div
      ref={scrollArea}
      role="log"
      aria-label={t('messages')}
      aria-live="polite"
      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-8 md:px-8"
    >
      {conversation.messages.length === 0 ? (
        <EmptyDataState
          titleText={t('no-messages')}
          description={t('first-message', { name: conversation.name })}
          icon={<ChatIcon name="empty" width={48} />}
          className="h-full min-h-60 rounded-none bg-transparent p-0 [&_h3]:mt-4 [&_h3]:text-base [&_p]:max-w-80 [&_p]:text-[13px]"
        />
      ) : (
        <div className="space-y-6 pt-6">
          {conversation.messages.map((message, index) => (
            <Fragment key={message.id}>
              {(index === 0 ||
                conversation.messages[index - 1].day !== message.day) && (
                <div className="flex justify-center">
                  <span className="bg-chat-surface text-muted-foreground rounded-full px-3 py-1 text-xs leading-3.75">
                    {t(message.day)}
                  </span>
                </div>
              )}
              <ChatMessageItem
                message={message}
                avatar={conversation.avatar}
                closed={Boolean(conversation.closedAt)}
                onReply={onReply}
                onPreview={onPreview}
                onDownload={onDownload}
              />
            </Fragment>
          ))}
          {conversation.closedAt && (
            <p className="bg-chat-surface text-chat-muted mx-auto w-fit rounded-full px-3 py-1 text-center text-xs leading-4">
              {t('closed-by-you', {
                date: formatChatDate(conversation.closedAt, locale),
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
