export type CandidateCvContact = {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
};

export type CandidateCvExperience = {
  id: string;
  label: string;
  title: string;
  description: string;
  strengthsTitle: string;
  strengths: string[];
};

export type CandidateCvEntry = {
  id: string;
  title: string;
  meta: string;
  url?: string;
};

export type CandidateCvCertification = {
  id: string;
  title: string;
  issuer: string;
  period: string;
};

export type CandidateCvEducation = {
  id: string;
  degree: string;
  institution: string;
  period: string;
};

export type CandidateCvLanguage = {
  id: string;
  name: string;
  level: string;
  rating: number;
};

export type CandidateCvDetailKey =
  | 'nationality'
  | 'year-of-birth'
  | 'marital-status';

export type CandidateCvDetail = {
  key: CandidateCvDetailKey;
  value: string;
};

export type CandidateCv = {
  name: string;
  jobTitle: string;
  contact: CandidateCvContact;
  summary: string;
  skills: string[];
  experiences: CandidateCvExperience[];
  publications: CandidateCvEntry[];
  conferences: CandidateCvEntry[];
  highlights: string[];
  certifications: CandidateCvCertification[];
  educations: CandidateCvEducation[];
  languages: CandidateCvLanguage[];
  additionalInfo: CandidateCvDetail[];
};
