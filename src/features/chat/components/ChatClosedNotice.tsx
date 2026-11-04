import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import ChatIcon from './ChatIcon';

type ChatClosedNoticeProps = { name: string; onReopen: () => void };

export default function ChatClosedNotice({
  name,
  onReopen,
}: ChatClosedNoticeProps) {
  const t = useTranslations('companyPage.chat');
  return (
    <div className="bg-chat-surface border-border flex flex-wrap items-center gap-3 rounded-2xl border p-4">
      <ChatIcon name="lock-banner" width={22} />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-secondary text-sm leading-5 font-semibold">
          {t('this-chat-is-closed')}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-4.5">
          {t('closed-description', { name })}
        </p>
      </div>
      <Button
        type="button"
        onClick={onReopen}
        className="bg-chat-primary h-10 rounded-xl px-4 text-sm font-semibold"
      >
        {t('reopen-chat')}
      </Button>
    </div>
  );
}
