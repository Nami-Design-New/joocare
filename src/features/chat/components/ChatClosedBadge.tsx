import { useTranslations } from 'next-intl';
import ChatIcon from './ChatIcon';

export default function ChatClosedBadge() {
  const t = useTranslations('companyPage.chat');
  return (
    <span className="text-chat-muted bg-chat-surface inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] leading-3.5 font-semibold">
      <ChatIcon name="lock" width={12} />
      {t('chat-closed')}
    </span>
  );
}
