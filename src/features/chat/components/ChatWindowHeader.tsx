import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import type { ChatConversation, ChatRole } from '../types/chat.types';
import ChatIcon from './ChatIcon';
import ChatClosedBadge from './ChatClosedBadge';
import ChatCloseMenu from './ChatCloseMenu';

type ChatWindowHeaderProps = {
  role: ChatRole;
  conversation: ChatConversation;
  onBack: () => void;
  onClose?: () => void;
  onReopen?: () => void;
};

export default function ChatWindowHeader({
  role,
  conversation,
  onBack,
  onClose,
  onReopen,
}: ChatWindowHeaderProps) {
  const t = useTranslations('companyPage.chat');
  const tCandidate = useTranslations('candidatePage.chat');
  const isCandidate = role === 'candidate';
  const closed = Boolean(conversation.closedAt);

  return (
    <header className="border-border bg-card flex min-h-20 shrink-0 items-center gap-3 border-b px-4 py-3 md:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onBack}
        aria-label={t('back-to-conversations')}
      >
        <ChatIcon name="back" className="brightness-0 rtl:rotate-180" />
      </Button>
      <Image
        src={conversation.avatar}
        width={isCandidate ? 56 : 40}
        height={isCandidate ? 56 : 40}
        alt=""
        className={
          isCandidate
            ? 'size-11 shrink-0 rounded-xl object-cover sm:size-14'
            : 'size-10 shrink-0 rounded-lg object-cover'
        }
      />
      <div className="min-w-0 flex-1">
        {isCandidate ? (
          <>
            <p className="text-secondary truncate text-base leading-5 font-semibold">
              {conversation.name}
            </p>
            <p className="text-muted-foreground mt-1 truncate text-xs leading-4">
              {conversation.jobTitle}
            </p>
            <Link
              href={conversation.profileHref}
              aria-label={tCandidate('view-company-profile', {
                company: conversation.companyName ?? '',
              })}
              className="text-chat-link mt-1 inline-flex max-w-full items-center gap-1.5 text-sm leading-5 hover:underline"
            >
              <span className="truncate">{conversation.companyName}</span>
              <ExternalLink className="size-4 shrink-0 rtl:-scale-x-100" />
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={conversation.profileHref}
                className="text-secondary truncate text-base leading-5 font-semibold underline underline-offset-2"
              >
                {conversation.name}
              </Link>
              {closed && <ChatClosedBadge role={role} />}
            </div>
            <p className="text-muted-foreground mt-1 truncate text-xs leading-4">
              {conversation.jobTitle}
            </p>
          </>
        )}
      </div>
      {isCandidate && closed && <ChatClosedBadge role={role} />}
      {onClose && onReopen && (
        <ChatCloseMenu closed={closed} onClose={onClose} onReopen={onReopen} />
      )}
    </header>
  );
}
