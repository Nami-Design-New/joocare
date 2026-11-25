import { getCandidateProfileHref } from '@/features/company-projects/utils/candidate-profile-href';
import { CHAT_COMPANY_PROFILE_ROUTE, CHAT_DEFAULT_AVATAR } from '../constants';
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
      name: file.name || imageLabel,
      kind: isImageFile(file) ? ('image' as const) : ('file' as const),
      size: file.size ?? '',
      url: file.url,
    })),
  ];
}

const IMAGE_EXTENSION = /.(jpe?g|png|webp|gif)$/i;

function isImageFile(file: ChatApiFile) {
  return file.type
    ? file.type.startsWith('image')
    : IMAGE_EXTENSION.test(file.url ?? '');
}

function getFirstImage(message: Pick<ChatApiMessage, 'images' | 'files'>) {
  return message.images?.[0]?.image ?? message.files?.find(isImageFile)?.url;
}

function getLastMessagePreview(
  message: ChatApiMessage | null,
  imageLabel: string,
) {
  if (!message) return '';
  if (message.message) return message.message;
  const file = message.files?.find((item) => !isImageFile(item));
  if (file) return file.name;
  return getFirstImage(message) ? imageLabel : '';
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
    profileHref: conversation.company_id
      ? `${CHAT_COMPANY_PROFILE_ROUTE}/${conversation.company_id}`
      : undefined,
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
    profileHref: getCandidateProfileHref(conversation.user_id),
    name: conversation.name,
    jobTitle: conversation.job_title ?? '',
    recruiter: conversation.contacted_by ?? '',
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
          image: getFirstImage(reply),
        }
      : undefined,
  };
}

/**
 * Adds the messages to the conversation. The messages response also carries the
 * conversation status (fresher than the list's) and, for companies, whether another
 * recruiter already contacted the candidate.
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
    alreadyContacted: Boolean(data.contacted_before),
    recruiter: data.contacted_by ?? conversation.recruiter,
    contactedAt: data.contacted_at ?? undefined,
    // The API returns the newest message first.
    messages: data.messages
      .slice()
      .reverse()
      .map((message) => mapMessage(message, viewer, conversation, labels)),
  };
}
