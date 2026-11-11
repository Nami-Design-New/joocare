import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { useChatCopy } from '../hooks/useChatCopy';
import type { ChatConversation, ChatRole } from '../types/chat.types';
import ChatIcon from './ChatIcon';

type ChatClosedNoticeProps = {
  role: ChatRole;
  conversation: ChatConversation;
  /** Only the side that closed the chat can reopen it. */
  onReopen?: () => void;
};

export default function ChatClosedNotice({
  role,
  conversation,
  onReopen,
}: ChatClosedNoticeProps) {
  const t = useTranslations('companyPage.chat');
  const copy = useChatCopy(role);
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-chat-surface p-4"
    >
      <ChatIcon
        name={role === 'candidate' ? 'close-chat' : 'lock-banner'}
        width={22}
      />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-sm leading-5 font-semibold text-secondary">
          {copy.closedNoticeTitle(conversation)}
        </p>
        <p className="mt-1 text-xs leading-4.5 text-muted-foreground">
          {copy.closedNoticeDescription(conversation)}
        </p>
      </div>
      {onReopen && (
        <Button
          type="button"
          onClick={onReopen}
          className="h-10 rounded-xl bg-chat-primary px-4 text-sm font-semibold"
        >
          {t('reopen-chat')}
        </Button>
      )}
    </div>
  );
}
