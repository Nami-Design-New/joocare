import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import ChatIcon from './ChatIcon';

type ChatCloseMenuProps = {
  closed: boolean;
  onClose: () => void;
  onReopen: () => void;
};

export default function ChatCloseMenu({
  closed,
  onClose,
  onReopen,
}: ChatCloseMenuProps) {
  const t = useTranslations('companyPage.chat');
  return (
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
          onSelect={closed ? onReopen : onClose}
          className="text-chat-danger bg-chat-danger-bg focus:bg-chat-danger-bg focus:text-chat-danger gap-2 rounded-lg px-3 py-2.5 text-sm"
        >
          <ChatIcon name="close-chat" width={18} />
          {t(closed ? 'reopen-chat' : 'close-chat')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
