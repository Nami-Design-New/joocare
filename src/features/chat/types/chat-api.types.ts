export type ChatApiId = number | string;

export type ChatApiSender = 'user' | 'company';

export type ChatApiConversationStatus = 'open' | 'closed';

export type ChatApiImage = {
  id: ChatApiId;
  image: string;
};

/** Non-image attachments (PDF). Pending on the backend, see docs/company-features/chat-backend-requirements.md. */
export type ChatApiFile = {
  id: ChatApiId;
  name: string;
  size?: string;
  type?: string;
  url: string;
};

export type ChatApiReplyMessage = {
  id: ChatApiId;
  message: string;
  type: string;
  images: ChatApiImage[];
  files?: ChatApiFile[];
  sender_type: ChatApiSender;
};

export type ChatApiMessage = {
  id: ChatApiId;
  message: string;
  type: string;
  images: ChatApiImage[];
  files?: ChatApiFile[];
  company_admin_id: ChatApiId;
  user_id: ChatApiId;
  sender_type: ChatApiSender;
  receiver_type: ChatApiSender;
  /** Already formatted by the backend in the request locale. */
  created_at: string;
  replied_message_id: ChatApiId | null;
  replied_message: ChatApiReplyMessage | null;
  is_read: boolean;
  updated_at: string;
};

export type ChatApiMessages = {
  status: ChatApiConversationStatus;
  closed_at?: string | null;
  messages: ChatApiMessage[];
};

type ChatApiConversationBase = {
  name: string;
  image: string | null;
  unread_count: number;
  status: ChatApiConversationStatus;
  closed_at?: string | null;
  last_message: ChatApiMessage | null;
};

export type CandidateChatApiConversation = ChatApiConversationBase & {
  company_admin_id: ChatApiId;
  job_title: string;
  company_name: string;
};

export type ChatApiContactedBy = {
  id: ChatApiId;
  name: string;
};

export type CompanyChatApiConversation = ChatApiConversationBase & {
  user_id: ChatApiId;
  job_title?: string | null;
  contacted_by?: ChatApiContactedBy | null;
  contacted_at?: string | null;
};
