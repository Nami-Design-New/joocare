import { CHAT_DEFAULT_AVATAR } from '../constants';
import type {
  CandidateChatApiConversation,
  ChatApiFile,
  ChatApiImage,
  ChatApiMessage,
  ChatApiMessages,
  ChatApiSender,
  CompanyChatApiConversation,
} from '../types/chat-api.types';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
} from '../types/chat.types';

export type ChatMapperLabels = {
  you: string;
  imageAttachment: string;
};

function mapAttachments(
  images: ChatApiImage[] = [],
  files: ChatApiFile[] = [],
  imageLabel: string,
): ChatAttachment[] {
  return [
    ...images.map((image) => ({
      id: `image-${image.id}`,
      name: imageLabel,
      kind: 'image' as const,
      size: '',
      url: image.image,
    })),
    ...files.map((file) => ({
      id: `file-${file.id}`,
      name: file.name,
      kind: 'file' as const,
      size: file.size ?? '',
      url: file.url,
    })),
  ];
}

function getLastMessagePreview(
  message: ChatApiMessage | null,
  imageLabel: string,
) {
  if (!message) return '';
  if (message.message) return message.message;
  if (message.files?.length) return message.files[0].name;
  return message.images?.length ? imageLabel : '';
}

function mapConversationBase(
  conversation: CandidateChatApiConversation | CompanyChatApiConversation,
  imageLabel: string,
) {
  return {
    avatar: conversation.image || CHAT_DEFAULT_AVATAR,
    lastMessage: getLastMessagePreview(conversation.last_message, imageLabel),
    updatedAt: conversation.last_message?.created_at ?? '',
    unread: conversation.unread_count,
    closed: conversation.status === 'closed',
    closedAt: conversation.closed_at ?? undefined,
    messages: [],
  };
}

export function mapCandidateConversation(
  conversation: CandidateChatApiConversation,
  labels: ChatMapperLabels,
): ChatConversation {
  return {
    ...mapConversationBase(conversation, labels.imageAttachment),
    id: String(conversation.company_admin_id),
    name: conversation.name,
    jobTitle: conversation.job_title,
    companyName: conversation.company_name,
    recruiter: conversation.name,
  };
}

export function mapCompanyConversation(
  conversation: CompanyChatApiConversation,
  labels: ChatMapperLabels,
): ChatConversation {
  return {
    ...mapConversationBase(conversation, labels.imageAttachment),
    id: String(conversation.user_id),
    name: conversation.name,
    jobTitle: conversation.job_title ?? '',
    recruiter: conversation.contacted_by?.name ?? '',
    alreadyContacted: Boolean(conversation.contacted_by),
    contactedAt: conversation.contacted_at ?? undefined,
  };
}

function mapMessage(
  message: ChatApiMessage,
  viewer: ChatApiSender,
  conversation: ChatConversation,
  labels: ChatMapperLabels,
): ChatMessage {
  const reply = message.replied_message;
  const incoming = message.sender_type !== viewer;
  return {
    id: String(message.id),
    direction: incoming ? 'incoming' : 'outgoing',
    text: message.message ?? '',
    sentAt: message.created_at,
    avatar: incoming ? conversation.avatar : undefined,
    attachments: mapAttachments(
      message.images,
      message.files,
      labels.imageAttachment,
    ),
    reply: reply
      ? {
          id: String(reply.id),
          name: reply.sender_type === viewer ? labels.you : conversation.name,
          text: reply.message ?? '',
          image: reply.images?.[0]?.image,
        }
      : undefined,
  };
}

/**
 * Adds the messages to the conversation. The messages response also carries the
 * conversation status, which is fresher than the list's.
 */
export function withConversationMessages(
  conversation: ChatConversation,
  data: ChatApiMessages | undefined,
  viewer: ChatApiSender,
  labels: ChatMapperLabels,
): ChatConversation {
  if (!data) return conversation;
  return {
    ...conversation,
    closed: data.status === 'closed',
    closedAt: data.closed_at ?? conversation.closedAt,
    // The API returns the newest message first.
    messages: data.messages
      .slice()
      .reverse()
      .map((message) => mapMessage(message, viewer, conversation, labels)),
  };
}
