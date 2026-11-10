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
      className="bg-chat-surface border-border flex flex-wrap items-center gap-3 rounded-2xl border p-4"
    >
      <ChatIcon
        name={role === 'candidate' ? 'close-chat' : 'lock-banner'}
        width={22}
      />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-secondary text-sm leading-5 font-semibold">
          {copy.closedNoticeTitle(conversation)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-4.5">
          {copy.closedNoticeDescription(conversation)}
        </p>
      </div>
      {onReopen && (
        <Button
          type="button"
          onClick={onReopen}
          className="bg-chat-primary h-10 rounded-xl px-4 text-sm font-semibold"
        >
          {t('reopen-chat')}
        </Button>
      )}
    </div>
  );
}
