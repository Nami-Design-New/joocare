import type { ChatConversation, ChatScenario } from '../types/chat.types';

const companyProfileHref = (slug: string) => `/shared-company-profile/${slug}`;

// Local design fixtures for the candidate chat. No messages are sent to a server by this UI preview.
export function createCandidateChatPreview(
  scenario: ChatScenario,
): ChatConversation[] {
  const closed = scenario === 'closed';
  return [
    {
      id: 'sara',
      profileHref: companyProfileHref('saudi-german-hospital'),
      name: 'Sara Al-Mutairi',
      jobTitle: 'Talent Acquisition Specialist',
      companyName: 'Saudi German Hospital',
      avatar: '/assets/chat/emily.png',
      lastMessage:
        '"I\'ve attached the job description and benefits summary for your review."',
      updatedAt: '2026-09-23T10:15:00Z',
      unread: 0,
      recruiter: 'Sara Al-Mutairi',
      closedAt: closed ? '2026-09-23T16:30:00Z' : undefined,
      messages: [
        {
          id: 'introduction',
          direction: 'incoming',
          text: "Hello Dr. Ahmed! I've reviewed your application for the Consultant Cardiologist position at our Jeddah cardiac center. Your interventional experience is exactly what our team needs.",
          sentAt: '2026-09-22T10:42:00Z',
          day: 'yesterday',
        },
        {
          id: 'availability',
          direction: 'outgoing',
          text: "Thank you, Sara. I'm very interested in the role and the cath-lab expansion. I'm available for a brief introductory call any day this week.",
          sentAt: '2026-09-22T11:15:00Z',
          day: 'yesterday',
        },
        {
          id: 'job-description',
          direction: 'incoming',
          text: "Great — Wednesday at 11:00 AM works for us. I've attached the job description and benefits summary for your review before we speak.",
          sentAt: '2026-09-23T10:15:00Z',
          day: 'today',
          attachments: [
            {
              id: 'job-description-file',
              name: 'JD_Cardiologist_SGH.pdf',
              kind: 'file',
              size: '1.2 MB',
            },
          ],
        },
      ],
    },
    {
      id: 'omar',
      profileHref: companyProfileHref('dr-sulaiman-al-habib-medical-group'),
      name: 'Omar Haddad',
      jobTitle: 'HR Business Partner',
      companyName: 'Dr. Sulaiman Al Habib Medical Group',
      avatar: '/assets/chat/ahmed.png',
      lastMessage:
        "The relocation package looks comprehensive. Let's discuss the next steps.",
      updatedAt: '2026-09-12T18:20:00Z',
      unread: 0,
      recruiter: 'Omar Haddad',
      messages: [
        {
          id: 'relocation',
          direction: 'incoming',
          text: "The relocation package looks comprehensive. Let's discuss the next steps.",
          sentAt: '2026-09-12T18:20:00Z',
          day: 'today',
        },
      ],
    },
    {
      id: 'layla',
      profileHref: companyProfileHref('cleveland-clinic-abu-dhabi'),
      name: 'Layla Mansour',
      jobTitle: 'Senior Recruiter',
      companyName: 'Cleveland Clinic Abu Dhabi',
      avatar: '/assets/chat/sarah.png',
      lastMessage: 'Looking forward to the interview tomorrow at 9 AM.',
      updatedAt: '2026-09-10T14:05:00Z',
      unread: 2,
      recruiter: 'Layla Mansour',
      messages: [
        {
          id: 'interview',
          direction: 'incoming',
          text: 'Looking forward to the interview tomorrow at 9 AM.',
          sentAt: '2026-09-10T14:05:00Z',
          day: 'today',
        },
      ],
    },
    {
      id: 'khalid',
      profileHref: companyProfileHref('king-faisal-specialist-hospital'),
      name: 'Khalid Al-Qahtani',
      jobTitle: 'Medical Staffing Lead',
      companyName: 'King Faisal Specialist Hospital',
      avatar: '/assets/chat/marcus.png',
      lastMessage:
        'Thank you for your application, we will get back to you shortly.',
      updatedAt: '2026-09-22T09:00:00Z',
      unread: 0,
      recruiter: 'Khalid Al-Qahtani',
      messages: [],
    },
  ];
}
