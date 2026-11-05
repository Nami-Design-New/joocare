import type { TAdditionalInfoSchema } from '../validation/additional-info-schema';

export type AdditionalInfoValues = TAdditionalInfoSchema;

export type AdditionalInfoSectionKey =
  | 'qualifications'
  | 'languages'
  | 'mobility'
  | 'career'
  | 'professional'
  | 'personal'
  | 'salary';

export type JobSearchStatus =
  | 'open-to-work'
  | 'actively-looking'
  | 'open-to-opportunities';

export type CompletionItem = {
  section: AdditionalInfoSectionKey;
  done: boolean;
};
