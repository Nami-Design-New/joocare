export type ChatApiId = number | string;

export type ChatApiSender = 'user' | 'company';

export type ChatApiConversationStatus = 'open' | 'closed';

export type ChatApiImage = {
  id: ChatApiId;
  image: string;
};

/** Message attachments (images + PDF). The item shape is not confirmed by the backend yet. */
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
  /** Replaced by `files`; kept for older responses. */
  images?: ChatApiImage[];
  files?: ChatApiFile[];
  sender_type: ChatApiSender;
};

export type ChatApiMessage = {
  id: ChatApiId;
  message: string;
  type: string;
  /** Replaced by `files`; kept for older responses. */
  images?: ChatApiImage[];
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
  /** Company only: another recruiter in the company already talked to this candidate. */
  contacted_before?: boolean;
  contacted_by?: string | null;
  contacted_at?: string | null;
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
  company_id?: ChatApiId | null;
};

export type CompanyChatApiConversation = ChatApiConversationBase & {
  user_id: ChatApiId;
  job_title?: string | null;
  /** The recruiter who owns this conversation ("Contacted by" in the super-admin list). */
  contacted_by?: string | null;
};
