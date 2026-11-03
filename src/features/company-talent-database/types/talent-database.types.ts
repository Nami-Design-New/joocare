export type TalentFilterValues = Record<string, string | string[]>;

export type TalentFilterField = {
  key: string;
  kind?: 'text' | 'number' | 'multi';
  options?: readonly string[];
  placeholder?: string;
};

export type TalentCandidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  score: number;
  cv: string;
  attributes: Record<string, string | string[]>;
};

export type TalentMessageValues = { message: string };

// The message dialog only needs these, so other candidate lists can reuse it.
export type MessageRecipient = Pick<TalentCandidate, 'id' | 'name'>;
