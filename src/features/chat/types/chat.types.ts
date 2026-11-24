export type ChatAttachment = {
  id: string;
  name: string;
  kind: 'image' | 'file';
  size: string;
  url?: string;
  file?: File;
};

export type ChatReply = {
  id?: string;
  name: string;
  text: string;
  image?: string;
};

export type ChatMessage = {
  id: string;
  direction: 'incoming' | 'outgoing';
  text: string;
  sentAt: string;
  day?: 'yesterday' | 'today';
  avatar?: string;
  attachments?: ChatAttachment[];
  reply?: ChatReply;
  fixedLines?: boolean;
};

export type ChatRole = 'company' | 'candidate';

export type ChatConversation = {
  id: string;
  /** Profile of the other party: the candidate for companies, the company for candidates. */
  profileHref?: string;
  name: string;
  jobTitle: string;
  /** Candidate conversations only: the employer the recruiter works for. */
  companyName?: string;
  avatar: string;
  lastMessage: string;
  updatedAt: string;
  unread: number;
  /** Company conversations only: the recruiter who already contacted this candidate. */
  recruiter: string;
  closed: boolean;
  closedAt?: string;
  alreadyContacted?: boolean;
  contactedAt?: string;
  messages: ChatMessage[];
};

export type SendChatMessage = {
  text: string;
  attachments: ChatAttachment[];
  reply?: ChatReply;
};

/** Everything `ChatView` needs from a role hook (`useCandidateChat`, `useCompanyChat`). */
export type ChatViewState = {
  conversations: ChatConversation[];
  activeConversation?: ChatConversation;
  mobileConversationOpen: boolean;
  search: string;
  setSearch: (value: string) => void;
  selectConversation: (id?: string) => void;
  sendMessage: (message: SendChatMessage) => Promise<boolean>;
  /** Company only. */
  setClosed?: (closed: boolean) => void;
  isClosePending?: boolean;
  dismissContactWarning: () => void;
  previewImage: ChatAttachment | null;
  setPreviewImage: (attachment: ChatAttachment | null) => void;
  downloadAttachment: (attachment: ChatAttachment) => void;
  createObjectUrl: (file: File) => string;
};
