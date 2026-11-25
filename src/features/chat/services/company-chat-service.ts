import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { SendChatMessage } from '../types/chat.types';
import type {
  ChatApiId,
  ChatApiMessage,
  ChatApiMessages,
  CompanyChatApiConversation,
} from '../types/chat-api.types';
import {
  createChatMessageBody,
  getChatPageParams,
  type ChatRequest,
} from '../utils/chat-request';

export async function getCompanyConversations({
  token,
  locale,
  page,
}: ChatRequest) {
  const { ok, data, message } = await apiFetch<CompanyChatApiConversation[]>(
    `${getCompanyApiUrl()}/conversations?${getChatPageParams(page)}`,
    { method: 'GET', locale, token },
  );

  if (!ok || !Array.isArray(data?.data)) {
    throw new Error(message || 'Failed to load conversations.');
  }

  return data.data;
}

export async function getCompanyMessages({
  token,
  locale,
  page,
  userId,
}: ChatRequest & { userId: ChatApiId }) {
  const params = getChatPageParams(page, { user_id: String(userId) });
  const { ok, data, message } = await apiFetch<ChatApiMessages>(
    `${getCompanyApiUrl()}/messages?${params}`,
    { method: 'GET', locale, token },
  );

  if (!ok || !Array.isArray(data?.data?.messages)) {
    throw new Error(message || 'Failed to load messages.');
  }

  return data.data;
}

export async function sendCompanyMessage({
  token,
  locale,
  userId,
  value,
}: Omit<ChatRequest, 'page'> & { userId: ChatApiId; value: SendChatMessage }) {
  const { ok, data, message } = await apiFetch<ChatApiMessage>(
    `${getCompanyApiUrl()}/messages`,
    {
      method: 'POST',
      locale,
      token,
      body: createChatMessageBody({
        recipientField: 'user_id',
        recipientId: userId,
        attachmentsField: 'files',
        value,
      }),
    },
  );

  if (!ok || !data?.data) {
    throw new Error(message || 'Failed to send message.');
  }

  return data.data;
}

export async function setCompanyConversationClosed({
  token,
  locale,
  userId,
  closed,
}: Omit<ChatRequest, 'page'> & { userId: ChatApiId; closed: boolean }) {
  const body = new FormData();
  body.append('user_id', String(userId));
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/conversations/${closed ? 'close' : 'reopen'}`,
    { method: 'POST', locale, token, body },
  );

  if (!ok) {
    throw new Error(
      message ||
        (closed
          ? 'Failed to close the conversation.'
          : 'Failed to reopen the conversation.'),
    );
  }
}
