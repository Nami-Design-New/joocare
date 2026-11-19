import type {
  CandidateChatApiConversation,
  ChatApiMessage,
} from '../types/candidate-chat-api.types';
import type { ChatConversation, ChatMessage } from '../types/chat.types';

function mapApiMessage(
  message: ChatApiMessage,
  conversationAvatar: string,
  youLabel: string,
  companyContactName: string,
  imageAttachmentLabel: string,
): ChatMessage {
  const repliedMessage = message.replied_message;

  return {
    id: String(message.id),
    direction: message.sender_type === 'user' ? 'outgoing' : 'incoming',
    text: message.message ?? '',
    sentAt: message.created_at,
    avatar: message.sender_type === 'company' ? conversationAvatar : undefined,
    attachments: (message.images ?? []).map((image) => ({
      id: String(image.id),
      name: imageAttachmentLabel,
      kind: 'image',
      size: '',
      url: image.image,
    })),
    reply: repliedMessage
      ? {
          id: String(repliedMessage.id),
          name:
            repliedMessage.sender_type === 'user'
              ? youLabel
              : companyContactName,
          text: repliedMessage.message ?? '',
          image: repliedMessage.images?.[0]?.image,
        }
      : undefined,
  };
}

export function mapCandidateConversation(
  conversation: CandidateChatApiConversation,
): ChatConversation {
  const id = String(conversation.company_admin_id);
  const avatar = conversation.image || '/assets/profile_image.svg';
  const lastMessage = conversation.last_message;

  return {
    id,
    name: conversation.name,
    jobTitle: conversation.job_title,
    companyName: conversation.company_name,
    avatar,
    lastMessage: lastMessage?.message ?? '',
    updatedAt: lastMessage?.updated_at ?? lastMessage?.created_at ?? '',
    unread: conversation.unread_count,
    recruiter: conversation.name,
    messages: [],
  };
}

export function mapCandidateMessages(
  messages: ChatApiMessage[],
  conversation: ChatConversation,
  youLabel: string,
  companyContactName: string,
  imageAttachmentLabel: string,
) {
  return messages
    .slice()
    .reverse()
    .map((message) =>
      mapApiMessage(
        message,
        conversation.avatar,
        youLabel,
        companyContactName,
        imageAttachmentLabel,
      ),
    );
}
