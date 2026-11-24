import { CHAT_PAGE_SIZE } from '../constants';
import type { ChatApiId } from '../types/chat-api.types';
import type { SendChatMessage } from '../types/chat.types';

export type ChatRequest = {
  token: string;
  locale: string;
  page?: number;
};

export function getChatPageParams(
  page = 1,
  extra: Record<string, string> = {},
) {
  return new URLSearchParams({
    ...extra,
    pagination: 'on',
    limit_per_page: String(CHAT_PAGE_SIZE),
    page: String(page),
  });
}

/** `recipientField` is `company_admin_id` for candidates and `user_id` for companies. */
export function createChatMessageBody(
  recipientField: 'company_admin_id' | 'user_id',
  recipientId: ChatApiId,
  value: SendChatMessage,
) {
  const body = new FormData();
  body.append(recipientField, String(recipientId));
  body.append('message', value.text.trim());
  if (value.reply?.id) body.append('replied_message_id', value.reply.id);
  value.attachments.forEach((attachment) => {
    if (!attachment.file) return;
    body.append(
      attachment.kind === 'image' ? 'images[]' : 'files[]',
      attachment.file,
    );
  });
  return body;
}
