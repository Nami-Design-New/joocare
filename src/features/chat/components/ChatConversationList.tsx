import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import SearchInput from '@/shared/components/SearchInput';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { cn } from '@/shared/lib/utils';
import { useChatCopy } from '../hooks/useChatCopy';
import type { ChatConversation, ChatRole } from '../types/chat.types';
import { formatChatDate } from '../utils/chat-format';
import ChatIcon from './ChatIcon';
import ChatClosedBadge from './ChatClosedBadge';

type ChatConversationListProps = {
  role: ChatRole;
  conversations: ChatConversation[];
  activeId?: string;
  search: string;
  superAdmin?: boolean;
  mobileConversationOpen: boolean;
  onSearch: (value: string) => void;
  onSelect: (id: string) => void;
};

export default function ChatConversationList({
  role,
  conversations,
  activeId,
  search,
  superAdmin = false,
  mobileConversationOpen,
  onSearch,
  onSelect,
}: ChatConversationListProps) {
  const t = useTranslations('companyPage.chat');
  const locale = useLocale();
  const copy = useChatCopy(role);
  const isCandidate = role === 'candidate';
  return (
    <aside
      aria-label={t('conversations')}
      className={cn(
        'flex w-full shrink-0 flex-col overflow-hidden border-border bg-chat-list md:w-80 md:border-e xl:w-95',
        mobileConversationOpen && 'hidden md:flex',
      )}
    >
      <div className="space-y-4 px-4 pt-4 pb-4 sm:px-6 sm:pt-6">
        <h1 className="text-xl leading-8 font-extrabold text-chat-heading sm:text-2xl">
          {copy.listTitle}
        </h1>
        <SearchInput
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10.25 rounded-[14px] ps-10 pe-3 text-sm placeholder:text-chat-search"
          icon={<ChatIcon name="search" width={14} height={14} />}
        />
      </div>
      <nav
        aria-label={t('conversations')}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-6"
      >
        {conversations.map((conversation) => {
          const active = conversation.id === activeId;
          const closed = Boolean(conversation.closedAt);
          const subtitle = [conversation.jobTitle, conversation.companyName]
            .filter(Boolean)
            .join(' · ');
          const preview =
            isCandidate && closed
              ? copy.closedLabel
              : conversation.lastMessage || t('no-messages');
          return (
            <button
              key={conversation.id}
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                'flex w-full cursor-pointer items-start gap-3 rounded-xl border border-transparent p-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-chat-primary',
                active
                  ? 'min-h-21 border-border bg-card'
                  : 'mx-3 w-[calc(100%-1.5rem)] border-0 p-0 hover:bg-card/60',
              )}
            >
              <span className="relative shrink-0">
                <Image
                  src={conversation.avatar}
                  width={48}
                  height={48}
                  alt=""
                  className="size-12 rounded-xl object-cover"
                />
                {conversation.unread > 0 && (
                  <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-chat-primary text-[10px] text-primary-foreground">
                    {new Intl.NumberFormat(locale).format(conversation.unread)}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1 space-y-0.5">
                <span className="flex items-center justify-between gap-1">
                  <span className="truncate text-sm leading-5">
                    <bdi>{conversation.name}</bdi>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-[10px] leading-3.5',
                      active ? 'text-chat-primary' : 'text-muted-foreground',
                    )}
                  >
                    <bdi>
                      {conversation.updatedAt
                        ? formatChatDate(conversation.updatedAt, locale)
                        : t('new')}
                    </bdi>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      'truncate text-xs leading-4.75',
                      active ? 'text-chat-primary' : 'text-muted-foreground',
                    )}
                  >
                    <bdi>{subtitle}</bdi>
                  </span>
                  {closed && !isCandidate && <ChatClosedBadge role={role} />}
                </span>
                <span
                  className={cn(
                    'block truncate text-[11px] leading-[16.5px] text-muted-foreground',
                    conversation.unread && 'font-semibold text-foreground',
                    active && 'italic',
                  )}
                >
                  <bdi>{preview}</bdi>
                </span>
                {superAdmin && (
                  <span className="flex items-center gap-1 text-[11px] leading-4.5 text-chat-muted">
                    <ChatIcon name="contacted-by" width={12} />
                    {t('contacted-by')}{' '}
                    <span className="truncate font-medium">
                      {conversation.recruiter}
                    </span>
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {conversations.length === 0 && (
          <EmptyDataState
            titleText={t('no-results')}
            description={t('search-empty-description')}
            icon={<ChatIcon name="empty" width={48} />}
            className="bg-transparent px-3 [&_h3]:mt-3 [&_h3]:text-base"
          />
        )}
      </nav>
    </aside>
  );
}
