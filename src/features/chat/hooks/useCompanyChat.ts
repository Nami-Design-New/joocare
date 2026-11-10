'use client';

import {
  ASSESSMENT_ASSETS,
  externalInvitationSeeds,
} from '@/features/company-assessments/constants/assessment-invitations';
import { CHAT_ROUTES } from '../constants';
import { projectCandidatePreviewData } from '@/features/company-projects/constants/project-preview-data';
import { talentPreviewCandidates } from '@/features/company-talent-database/constants/talent-preview-data';
import { getTalentProfileHref } from '@/features/company-talent-database/utils/candidate-profile';
import { createChatPreview } from '../constants/chat-preview';
import type { ChatConversation, ChatViewOptions } from '../types/chat.types';
import { useChat } from './useChat';

export function useCompanyChat(
  options: ChatViewOptions & {
    conversationId?: string;
    initialConversation?: ChatConversation;
  },
) {
  return useChat({
    initialConversations: () => [
      ...(options.initialConversation ? [options.initialConversation] : []),
      ...createChatPreview(options.scenario),
      ...externalInvitationSeeds.map((candidate) => ({
        id: `assessment-${candidate.id}`,
        profileHref: `/company/candidate-profile?candidateId=${encodeURIComponent(candidate.id)}`,
        name: candidate.name,
        jobTitle: '',
        avatar: `${ASSESSMENT_ASSETS}/${candidate.image}`,
        lastMessage: '',
        updatedAt: '',
        unread: 0,
        recruiter: '',
        messages: [],
      })),
      ...projectCandidatePreviewData.map((candidate) => ({
        id: `project-${candidate.id}`,
        profileHref: `/company/candidate-profile?candidateId=${encodeURIComponent(candidate.id)}`,
        name: candidate.name,
        jobTitle: '',
        avatar: '/assets/company-projects/candidate-avatar.png',
        lastMessage: '',
        updatedAt: '',
        unread: 0,
        recruiter: '',
        messages: [],
      })),
      ...talentPreviewCandidates.map((candidate) => ({
        id: candidate.id,
        profileHref: getTalentProfileHref(candidate.id),
        name: candidate.name,
        jobTitle: '',
        avatar: candidate.image,
        lastMessage: '',
        updatedAt: '',
        unread: 0,
        recruiter: '',
        messages: [],
      })),
    ],
    conversationId: options.conversationId,
    getConversationHref: (id) => {
      const query = new URLSearchParams();
      if (id) query.set('conversation', id);
      if (options.initialConversation && id === options.initialConversation.id) {
        const candidate = options.initialConversation;
        query.set('candidateId', candidate.id.slice('user-'.length));
        query.set('candidateName', candidate.name);
        query.set('candidateImage', candidate.avatar);
      }
      if (options.superAdmin) query.set('view', 'super-admin');
      if (options.scenario !== 'conversation')
        query.set('scenario', options.scenario);
      return `${CHAT_ROUTES.company}${query.size ? `?${query}` : ''}`;
    },
  });
}
