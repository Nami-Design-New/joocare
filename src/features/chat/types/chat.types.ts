export type ChatAttachment = {
  id: string;
  name: string;
  kind: 'image' | 'file';
  size: string;
  url?: string;
};

export type ChatReply = {
  name: string;
  text: string;
  image?: string;
};

export type ChatMessage = {
  id: string;
  direction: 'incoming' | 'outgoing';
  text: string;
  sentAt: string;
  day: 'yesterday' | 'today';
  avatar?: string;
  attachments?: ChatAttachment[];
  reply?: ChatReply;
  fixedLines?: boolean;
};

export type ChatRole = 'company' | 'candidate';

export type ChatConversation = {
  id: string;
  /** Profile of the other party: the candidate for companies, the company for candidates. */
  profileHref: string;
  name: string;
  jobTitle: string;
  /** Candidate conversations only: the employer the recruiter works for. */
  companyName?: string;
  avatar: string;
  lastMessage: string;
  updatedAt: string;
  unread: number;
  recruiter: string;
  closedAt?: string;
  alreadyContacted?: boolean;
  messages: ChatMessage[];
};

export type ChatScenario =
  | 'conversation'
  | 'image-and-reply'
  | 'already-contacted'
  | 'closed';
export type ChatViewOptions = { superAdmin: boolean; scenario: ChatScenario };
export type SendChatMessage = {
  text: string;
  attachments: ChatAttachment[];
  reply?: ChatReply;
};
