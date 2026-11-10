import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { formatChatDate } from '../utils/chat-format';
import ChatIcon from './ChatIcon';

type ChatContactWarningProps = {
  name: string;
  recruiter: string;
  onDismiss: () => void;
};

export default function ChatContactWarning({
  name,
  recruiter,
  onDismiss,
}: ChatContactWarningProps) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  return (
    <div
      role="status"
      className="bg-chat-warning-bg border-chat-warning-border flex items-start gap-3 rounded-2xl border p-4"
    >
      <ChatIcon name="warning" width={22} />
      <div className="min-w-0 flex-1">
        <p className="text-chat-warning text-sm leading-5 font-semibold">
          {t('already-contacted-title')}
        </p>
        <p className="text-chat-warning mt-1 text-xs leading-4.5">
          {t('already-contacted-description', {
            name,
            recruiter,
            date: formatChatDate('2026-09-12T15:20:00Z', locale),
          })}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="-me-1 -mt-1"
        onClick={onDismiss}
        aria-label={t('dismiss-alert')}
      >
        <ChatIcon name="dismiss" width={16} />
      </Button>
    </div>
  );
}
