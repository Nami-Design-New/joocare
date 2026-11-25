'use client';

import { cn } from '@/shared/lib/utils';
import type { ChatMessage, ChatRole, ChatViewState } from '../types/chat.types';
import ChatConversationList from './ChatConversationList';
import ChatImageDialog from './ChatImageDialog';
import ChatWindow from './ChatWindow';

type ChatViewProps = {
  role: ChatRole;
  chat: ChatViewState;
  className?: string;
  superAdmin?: boolean;
  initialReplyMessage?: ChatMessage;
};

// Conversation list + active conversation + image preview, shared by the company and candidate chat pages.
export default function ChatView({
  role,
  chat,
  className,
  superAdmin,
  initialReplyMessage,
}: ChatViewProps) {
  const { setClosed } = chat;
  const canClose = role === 'company' && Boolean(setClosed);
  return (
    <div className={cn('flex overflow-hidden text-foreground', className)}>
      <ChatConversationList
        role={role}
        conversations={chat.conversations}
        activeId={chat.activeConversation?.id}
        search={chat.search}
        onSearch={chat.setSearch}
        superAdmin={superAdmin}
        mobileConversationOpen={chat.mobileConversationOpen}
        onSelect={chat.selectConversation}
      />
      {chat.activeConversation && (
        <ChatWindow
          key={chat.activeConversation.id}
          role={role}
          initialReplyMessage={initialReplyMessage}
          conversation={chat.activeConversation}
          mobileConversationOpen={chat.mobileConversationOpen}
          onBack={() => chat.selectConversation()}
          onClose={canClose ? () => setClosed?.(true) : undefined}
          onReopen={canClose ? () => setClosed?.(false) : undefined}
          closePending={chat.isClosePending}
          onSend={chat.sendMessage}
          onDismissWarning={chat.dismissContactWarning}
          onPreview={chat.setPreviewImage}
          onDownload={chat.downloadAttachment}
          createObjectUrl={chat.createObjectUrl}
        />
      )}
      <ChatImageDialog
        attachment={chat.previewImage}
        onClose={() => chat.setPreviewImage(null)}
        onDownload={chat.downloadAttachment}
      />
    </div>
  );
}
