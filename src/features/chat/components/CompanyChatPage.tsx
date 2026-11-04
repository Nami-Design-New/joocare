'use client';

import { useCompanyChat } from '../hooks/useCompanyChat';
import type { ChatViewOptions } from '../types/chat.types';
import ChatConversationList from './ChatConversationList';
import ChatWindow from './ChatWindow';
import ChatImageDialog from './ChatImageDialog';

type CompanyChatPageProps = ChatViewOptions & { conversationId?: string };

export default function CompanyChatPage(props: CompanyChatPageProps) {
  const chat = useCompanyChat(props);
  return (
    <div className="text-foreground mx-auto flex h-[calc(100dvh-4.75rem)]  overflow-hidden md:h-[calc(100dvh-10.875rem)] md:max-h-256 md:min-h-144">
      <ChatConversationList
        conversations={chat.conversations}
        activeId={chat.activeConversation?.id}
        search={chat.search}
        onSearch={chat.setSearch}
        superAdmin={props.superAdmin}
        mobileConversationOpen={chat.mobileConversationOpen}
        onSelect={chat.selectConversation}
      />
      {chat.activeConversation && (
        <ChatWindow
          initialReplyMessage={
            props.scenario === 'image-and-reply' &&
              chat.activeConversation.id === 'emily'
              ? chat.activeConversation.messages[0]
              : undefined
          }
          key={chat.activeConversation.id}
          conversation={chat.activeConversation}
          mobileConversationOpen={chat.mobileConversationOpen}
          onBack={() => chat.selectConversation()}
          onClose={() => chat.setClosed(true)}
          onReopen={() => chat.setClosed(false)}
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
