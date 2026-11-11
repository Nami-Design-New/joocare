'use client';

import { cn } from '@/shared/lib/utils';
import type { ChatState } from '../hooks/useChat';
import type { ChatMessage, ChatRole } from '../types/chat.types';
import ChatConversationList from './ChatConversationList';
import ChatImageDialog from './ChatImageDialog';
import ChatWindow from './ChatWindow';

type ChatViewProps = {
  role: ChatRole;
  chat: ChatState;
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
  const canClose = role === 'company';
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
          onClose={canClose ? () => chat.setClosed(true) : undefined}
          onReopen={canClose ? () => chat.setClosed(false) : undefined}
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
