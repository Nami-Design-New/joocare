import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { SendChatMessage } from '../types/chat.types';
import type {
  CandidateChatApiConversation,
  ChatApiId,
  ChatApiMessage,
  ChatApiMessages,
} from '../types/chat-api.types';
import {
  createChatMessageBody,
  getChatPageParams,
  type ChatRequest,
} from '../utils/chat-request';

export async function getCandidateConversations({
  token,
  locale,
  page,
}: ChatRequest) {
  const { ok, data, message } = await apiFetch<CandidateChatApiConversation[]>(
    `${getUserApiUrl()}/conversations?${getChatPageParams(page)}`,
    { method: 'GET', locale, token },
  );

  if (!ok || !Array.isArray(data?.data)) {
    throw new Error(message || 'Failed to load conversations.');
  }

  return data.data;
}

export async function getCandidateMessages({
  token,
  locale,
  page,
  companyAdminId,
}: ChatRequest & { companyAdminId: ChatApiId }) {
  const params = getChatPageParams(page, {
    company_admin_id: String(companyAdminId),
  });
  const { ok, data, message } = await apiFetch<ChatApiMessages>(
    `${getUserApiUrl()}/messages?${params}`,
    { method: 'GET', locale, token },
  );

  if (!ok || !Array.isArray(data?.data?.messages)) {
    throw new Error(message || 'Failed to load messages.');
  }

  return data.data;
}

export async function sendCandidateMessage({
  token,
  locale,
  companyAdminId,
  value,
}: Omit<ChatRequest, 'page'> & {
  companyAdminId: ChatApiId;
  value: SendChatMessage;
}) {
  const { ok, data, message } = await apiFetch<ChatApiMessage>(
    `${getUserApiUrl()}/messages`,
    {
      method: 'POST',
      locale,
      token,
      body: createChatMessageBody('company_admin_id', companyAdminId, value),
    },
  );

  if (!ok || !data?.data) {
    throw new Error(message || 'Failed to send message.');
  }

  return data.data;
}
