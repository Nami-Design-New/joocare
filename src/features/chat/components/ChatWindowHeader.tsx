import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { ChatConversation } from '../types/chat.types';
import ChatIcon from './ChatIcon';
import ChatClosedBadge from './ChatClosedBadge';

type ChatWindowHeaderProps = {
  conversation: ChatConversation;
  onBack: () => void;
  onClose: () => void;
  onReopen: () => void;
};

export default function ChatWindowHeader({
  conversation,
  onBack,
  onClose,
  onReopen,
}: ChatWindowHeaderProps) {
  const t = useTranslations('companyPage.chat');
  return (
    <header className="border-border bg-card flex h-20 shrink-0 items-center gap-3 border-b px-4 md:px-8">
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
        width={40}
        height={40}
        alt=""
        className="size-10 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/company/candidate-profile?candidateId=${conversation.candidateId}&source=talent-database`}
            className="text-secondary truncate text-base leading-5 font-semibold underline underline-offset-2"
          >
            {conversation.name}
          </Link>
          {conversation.closedAt && <ChatClosedBadge />}
        </div>
        <p className="text-muted-foreground mt-1 truncate text-xs leading-4">
          {conversation.jobTitle}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t('chat-actions')}
          >
            <ChatIcon name="menu" width={4} height={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="shadow-card w-48 rounded-2xl border-0 p-2"
        >
          <DropdownMenuItem
            onSelect={conversation.closedAt ? onReopen : onClose}
            className="text-chat-danger bg-chat-danger-bg focus:bg-chat-danger-bg focus:text-chat-danger gap-2 rounded-lg px-3 py-2.5 text-sm"
          >
            <ChatIcon name="close-chat" width={18} />
            {t(conversation.closedAt ? 'reopen-chat' : 'close-chat')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
