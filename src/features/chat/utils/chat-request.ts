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

type ChatMessageBodyOptions = {
  /** `company_admin_id` for candidates, `user_id` for companies. */
  recipientField: 'company_admin_id' | 'user_id';
  recipientId: ChatApiId;
  /** Candidates send `images[]`; companies send every attachment as `files[n]`. */
  attachmentsField: 'images' | 'files';
  value: SendChatMessage;
};

export function createChatMessageBody({
  recipientField,
  recipientId,
  attachmentsField,
  value,
}: ChatMessageBodyOptions) {
  const body = new FormData();
  body.append(recipientField, String(recipientId));
  body.append('message', value.text.trim());
  if (value.reply?.id) body.append('replied_message_id', value.reply.id);
  value.attachments
    .flatMap((attachment) => (attachment.file ? [attachment.file] : []))
    .forEach((file, index) => {
      body.append(
        attachmentsField === 'files' ? `files[${index}]` : 'images[]',
        file,
      );
    });
  return body;
}
