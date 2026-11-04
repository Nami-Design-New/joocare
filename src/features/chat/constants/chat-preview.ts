import type {
  ChatConversation,
  ChatMessage,
  ChatScenario,
} from '../types/chat.types';

// Local design fixtures. No messages are sent to a server by this UI preview.
export function createChatPreview(scenario: ChatScenario): ChatConversation[] {
  const emily = 'Dr. Emily Watson';
  const messages: ChatMessage[] = [
    {
      id: 'introduction',
      fixedLines: true,
      direction: 'incoming',
      text: "Hello! I've had a chance to review the Oncology\nDepartment Head position details. The emphasis on\nresearch integration is exactly what I'm looking for in my\nnext move.",
      sentAt: '2026-09-22T10:42:00Z',
      day: 'yesterday',
      avatar: '/assets/chat/sender-first.png',
    },
    {
      id: 'invitation',
      fixedLines: true,
      direction: 'outgoing',
      text: "That's great to hear, Dr. Watson. We're looking for someone\nwho can bridge the gap between clinical excellence and the\nresearch lab. Would you be available for a brief introductory\ncall this Wednesday?",
      sentAt: '2026-09-22T11:15:00Z',
      day: 'yesterday',
    },
    {
      id: 'certifications',
      fixedLines: true,
      direction: 'incoming',
      text: "Wednesday works perfectly. I've attached my clinical\ncertifications and a summary of my latest oncology\nresearch paper for your review before we speak.",
      sentAt: '2026-09-23T11:32:00Z',
      day: 'today',
      avatar: '/assets/chat/sender-second.png',
      attachments: [
        {
          id: 'certifications-file',
          name: 'Certifications_Watson_ICU.pdf',
          kind: 'file',
          size: '2.4 MB',
        },
      ],
    },
  ];
  const imageMessage: ChatMessage = {
    id: 'license',
    direction: 'incoming',
    text: 'Here’s a photo of my SCFHS license, as requested.',
    sentAt: '2026-09-23T11:32:00Z',
    day: 'today',
    avatar: '/assets/chat/sender-second.png',
    attachments: [
      {
        id: 'license-image',
        kind: 'image',
        name: 'SCFHS_License_Watson.jpg',
        size: '1.2 MB',
        url: '/assets/chat/license.png',
      },
    ],
  };
  const replyMessage: ChatMessage = {
    id: 'license-reply',
    direction: 'outgoing',
    text: 'Thank you, Dr. Watson — license received and verified. It’s valid until March 2028, so we’re all set for Wednesday.',
    sentAt: '2026-09-23T11:36:00Z',
    day: 'today',
    reply: {
      name: emily,
      text: 'Photo · Here’s a photo of my SCFHS license…',
      image: '/assets/chat/license.png',
    },
  };
  const isEmpty = scenario === 'already-contacted';
  return [
    {
      id: 'emily',
      candidateId: 'talent-5',
      name: emily,
      jobTitle: 'ICU Nurse Practitioner',
      avatar: '/assets/chat/emily.png',
      lastMessage: isEmpty
        ? ''
        : '"I\'ve attached my clinical certifications for your review."',
      updatedAt: isEmpty ? '' : '2026-09-23T11:32:00Z',
      unread: 0,
      recruiter: 'Sara Al-Otaibi',
      closedAt: scenario === 'closed' ? '2026-09-23T11:40:00Z' : undefined,
      alreadyContacted: isEmpty,
      messages: isEmpty
        ? []
        : scenario === 'image-and-reply'
          ? [imageMessage, replyMessage]
          : messages,
    },
    {
      id: 'ahmed',
      candidateId: 'talent-2',
      name: 'Ahmed Khalid',
      jobTitle: 'Senior Neurosurgeon',
      avatar: '/assets/chat/ahmed.png',
      lastMessage:
        "The relocation package looks comprehensive. Let's discuss the next steps.",
      updatedAt: '2026-09-23T10:05:00Z',
      unread: 0,
      recruiter: 'Omar Farouk',
      closedAt: '2026-09-23T11:40:00Z',
      messages: [
        {
          id: 'relocation',
          direction: 'incoming',
          text: "The relocation package looks comprehensive. Let's discuss the next steps.",
          sentAt: '2026-09-23T10:05:00Z',
          day: 'today',
        },
      ],
    },
    {
      id: 'sarah',
      candidateId: 'talent-3',
      name: 'Sarah Jenkins',
      jobTitle: 'Oncology Nurse',
      avatar: '/assets/chat/sarah.png',
      lastMessage: 'Looking forward to the interview tomorrow at 9 AM.',
      updatedAt: '2026-09-23T07:40:00Z',
      unread: 2,
      recruiter: 'Sara Al-Otaibi',
      messages: [
        {
          ...imageMessage,
          reply: undefined,
          text: 'Here’s a photo of my SCFHS license, as requested.',
        },
      ],
    },
    {
      id: 'marcus',
      candidateId: 'talent-4',
      name: 'Dr. Marcus Thorne',
      jobTitle: 'Chief of Medicine',
      avatar: '/assets/chat/marcus.png',
      lastMessage: 'Thank you for the update on the departmental budget.',
      updatedAt: '2026-09-22T16:18:00Z',
      unread: 0,
      recruiter: 'Layla Mansour',
      alreadyContacted: true,
      messages: [],
    },
  ];
}
