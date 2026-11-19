export type ChatApiId = number | string;

export type ChatApiImage = {
  id: ChatApiId;
  image: string;
};

export type ChatApiReplyMessage = {
  id: ChatApiId;
  message: string;
  type: string;
  images: ChatApiImage[];
  sender_type: 'user' | 'company';
};

export type ChatApiMessage = {
  id: ChatApiId;
  message: string;
  type: string;
  images: ChatApiImage[];
  company_admin_id: ChatApiId;
  user_id: ChatApiId;
  sender_type: 'user' | 'company';
  receiver_type: 'user' | 'company';
  created_at: string;
  replied_message_id: ChatApiId | null;
  replied_message: ChatApiReplyMessage | null;
  is_read: boolean;
  updated_at: string;
};

export type CandidateChatApiConversation = {
  company_admin_id: ChatApiId;
  name: string;
  image: string | null;
  job_title: string;
  company_name: string;
  unread_count: number;
  last_message: ChatApiMessage | null;
};
