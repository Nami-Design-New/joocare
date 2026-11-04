import { cn } from '@/shared/lib/utils';
import { useChatWindow } from '../hooks/useChatWindow';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
  SendChatMessage,
} from '../types/chat.types';
import ChatWindowHeader from './ChatWindowHeader';
import ChatTimeline from './ChatTimeline';
import ChatComposer from './ChatComposer';
import ChatContactWarning from './ChatContactWarning';
import ChatClosedNotice from './ChatClosedNotice';

type ChatWindowProps = {
  initialReplyMessage?: ChatMessage;
  conversation: ChatConversation;
  mobileConversationOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onReopen: () => void;
  onSend: (message: SendChatMessage) => void;
  onDismissWarning: () => void;
  onPreview: (attachment: ChatAttachment) => void;
  onDownload: (attachment: ChatAttachment) => void;
  createObjectUrl: (file: File) => string;
};

export default function ChatWindow({
  initialReplyMessage,
  conversation,
  mobileConversationOpen,
  onBack,
  onClose,
  onReopen,
  onSend,
  onDismissWarning,
  onPreview,
  onDownload,
  createObjectUrl,
}: ChatWindowProps) {
  const { replyMessage, replyToMessage, cancelReply, composerContainer } =
    useChatWindow(initialReplyMessage);
  return (
    <section
      className={cn(
        'bg-card flex min-w-0 flex-1 flex-col',
        !mobileConversationOpen && 'hidden md:flex',
      )}
    >
      <ChatWindowHeader
        conversation={conversation}
        onBack={onBack}
        onClose={onClose}
        onReopen={onReopen}
      />
      <ChatTimeline
        mobileConversationOpen={mobileConversationOpen}
        conversation={conversation}
        onReply={replyToMessage}
        onPreview={onPreview}
        onDownload={onDownload}
      />
      <div
        ref={composerContainer}
        className="shrink-0 space-y-3 px-4 pt-2 pb-5 md:px-6"
      >
        {conversation.closedAt ? (
          <ChatClosedNotice name={conversation.name} onReopen={onReopen} />
        ) : (
          <>
            {conversation.alreadyContacted && (
              <ChatContactWarning
                name={conversation.name}
                recruiter={conversation.recruiter}
                onDismiss={onDismissWarning}
              />
            )}
            <ChatComposer
              initialAttachments={initialReplyMessage?.attachments}
              name={conversation.name}
              replyMessage={replyMessage}
              onCancelReply={cancelReply}
              onSend={onSend}
              createObjectUrl={createObjectUrl}
            />
          </>
        )}
      </div>
    </section>
  );
}
