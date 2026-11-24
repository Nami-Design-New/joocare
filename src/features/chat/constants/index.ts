export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;
export const CHAT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const CHAT_ATTACHMENT_ACCEPT = `${CHAT_IMAGE_ACCEPT},application/pdf`;
export const CHAT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
export const CHAT_ASSET_PATH = '/assets/chat';
export const CHAT_DEFAULT_AVATAR = '/assets/profile_image.svg';
export const CHAT_PAGE_SIZE = 20;
export const CHAT_ROUTES = {
  company: '/company/chat',
  candidate: '/candidate/chat',
} as const;
/** The company role that sees every recruiter's conversations ("Contacted by" line). */
export const CHAT_SUPER_ADMIN_ROLE = 'recruitment_manager';

export const candidateChatQueryKeys = {
  conversations: (locale: string) => ['candidate-chat-conversations', locale],
  messages: (locale: string, companyAdminId: string) => [
    'candidate-chat-messages',
    locale,
    companyAdminId,
  ],
} as const;

export const companyChatQueryKeys = {
  conversations: (locale: string) => ['company-chat-conversations', locale],
  messages: (locale: string, userId: string) => [
    'company-chat-messages',
    locale,
    userId,
  ],
} as const;
