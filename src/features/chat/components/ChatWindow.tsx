import { cn } from '@/shared/lib/utils';
import { useChatWindow } from '../hooks/useChatWindow';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
  ChatRole,
  SendChatMessage,
} from '../types/chat.types';
import ChatWindowHeader from './ChatWindowHeader';
import ChatTimeline from './ChatTimeline';
import ChatComposer from './ChatComposer';
import ChatContactWarning from './ChatContactWarning';
import ChatClosedNotice from './ChatClosedNotice';

type ChatWindowProps = {
  role: ChatRole;
  initialReplyMessage?: ChatMessage;
  conversation: ChatConversation;
  mobileConversationOpen: boolean;
  onBack: () => void;
  /** Company only: close / reopen the conversation. */
  onClose?: () => void;
  onReopen?: () => void;
  closePending?: boolean;
  onSend: (
    message: SendChatMessage,
  ) => void | boolean | Promise<void | boolean>;
  onDismissWarning: () => void;
  onPreview: (attachment: ChatAttachment) => void;
  onDownload: (attachment: ChatAttachment) => void;
  createObjectUrl: (file: File) => string;
};

export default function ChatWindow({
  role,
  initialReplyMessage,
  conversation,
  mobileConversationOpen,
  onBack,
  onClose,
  onReopen,
  closePending,
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
        'flex min-w-0 flex-1 flex-col bg-card',
        !mobileConversationOpen && 'hidden md:flex',
      )}
    >
      <ChatWindowHeader
        role={role}
        conversation={conversation}
        onBack={onBack}
        onClose={onClose}
        onReopen={onReopen}
        closePending={closePending}
      />
      <ChatTimeline
        role={role}
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
        {conversation.closed ? (
          <ChatClosedNotice
            role={role}
            conversation={conversation}
            onReopen={onReopen}
            pending={closePending}
          />
        ) : (
          <>
            {conversation.alreadyContacted && (
              <ChatContactWarning
                name={conversation.name}
                recruiter={conversation.recruiter}
                contactedAt={conversation.contactedAt}
                onDismiss={onDismissWarning}
              />
            )}
            <ChatComposer
              initialAttachments={initialReplyMessage?.attachments}
              imagesOnly={role === 'candidate'}
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
