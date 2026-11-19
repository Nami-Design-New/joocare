import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { SendChatMessage } from '../types/chat.types';
import type {
  CandidateChatApiConversation,
  ChatApiId,
  ChatApiMessage,
} from '../types/candidate-chat-api.types';

const PAGE_SIZE = 20;

type CandidateChatRequest = {
  token: string;
  locale: string;
  page?: number;
};

export async function getCandidateConversations({
  token,
  locale,
  page = 1,
}: CandidateChatRequest) {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(PAGE_SIZE),
    page: String(page),
  });
  const { ok, data, message } = await apiFetch<CandidateChatApiConversation[]>(
    `${getUserApiUrl()}/conversations?${params}`,
    {
      method: 'GET',
      locale,
      token,
    },
  );

  if (!ok || !Array.isArray(data?.data)) {
    throw new Error(message || 'Failed to load conversations.');
  }

  return data.data;
}

export async function getCandidateMessages({
  token,
  locale,
  page = 1,
  companyAdminId,
}: CandidateChatRequest & { companyAdminId: ChatApiId }) {
  const params = new URLSearchParams({
    company_admin_id: String(companyAdminId),
    pagination: 'on',
    limit_per_page: String(PAGE_SIZE),
    page: String(page),
  });
  const { ok, data, message } = await apiFetch<ChatApiMessage[]>(
    `${getUserApiUrl()}/messages?${params}`,
    {
      method: 'GET',
      locale,
      token,
    },
  );

  if (!ok || !Array.isArray(data?.data)) {
    throw new Error(message || 'Failed to load messages.');
  }

  return data.data;
}

export async function sendCandidateMessage({
  token,
  locale,
  companyAdminId,
  value,
}: {
  token: string;
  locale: string;
  companyAdminId: ChatApiId;
  value: SendChatMessage;
}) {
  const body = new FormData();
  body.append('company_admin', String(companyAdminId));
  body.append('message', value.text.trim());

  if (value.reply?.id) {
    body.append('replied_message_id', value.reply.id);
  }

  value.attachments.forEach((attachment) => {
    if (attachment.file) {
      body.append('images[]', attachment.file);
    }
  });

  const { ok, data, message } = await apiFetch<ChatApiMessage>(
    `${getUserApiUrl()}/messages`,
    {
      method: 'POST',
      locale,
      token,
      body,
    },
  );

  if (!ok || !data?.data) {
    throw new Error(message || 'Failed to send message.');
  }

  return data.data;
}
