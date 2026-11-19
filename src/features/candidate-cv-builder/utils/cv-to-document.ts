import type {
  CandidateCv,
  CandidateCvDetail,
  CandidateCvExperience,
} from '../types/cv-document.types';
import type { CvBuilderValues } from '../types/cv-builder.types';

// Saved CVs return the level lowercased (`native`, `fluent`, ...), so look it
// up case-insensitively and keep the level text readable.
const LANGUAGE_LEVELS: Record<string, { level: string; rating: number }> = {
  native: { level: 'Native', rating: 5 },
  fluent: { level: 'Fluent', rating: 5 },
  advanced: { level: 'Advanced', rating: 4 },
  intermediate: { level: 'Intermediate', rating: 3 },
  beginner: { level: 'Beginner', rating: 2 },
};

function toLanguageLevel(proficiency: string) {
  return LANGUAGE_LEVELS[proficiency.trim().toLowerCase()];
}

// Translated UI labels the CV document needs (data values stay as entered).
export type CvDocumentLabels = {
  present: string;
  freshGraduate: string;
  professionalProfile: string;
  professionalStrengths: string;
  specialty: (value: string) => string;
  subspecialty: (value: string) => string;
  licensed: string;
  availableNow: string;
};

const join = (parts: Array<string | undefined>, separator = ', ') =>
  parts.filter(Boolean).join(separator);

// "2014-07" → "7 / 2014".
function formatMonth(value: string) {
  const [year, month] = value.split('-');
  return year && month ? `${Number(month)} / ${year}` : value;
}

function formatPeriod(start: string, end: string, endLabel = '') {
  const to = end ? formatMonth(end) : endLabel;
  return join([start && formatMonth(start), to], ' : ');
}

// Fresh-graduate text: first paragraph = profile, "- " lines = strengths.
function parseFreshGraduateProfile(text: string) {
  const lines = text.split('\n').map((line) => line.trim());
  const strengths = lines
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-\s*/, ''));
  const description = lines.find((line) => line && !line.startsWith('-')) ?? '';
  return { description, strengths };
}

function toExperiences(
  { experience }: CvBuilderValues,
  labels: CvDocumentLabels,
): CandidateCvExperience[] {
  if (experience.freshGraduate) {
    return [
      {
        id: 'fresh-graduate',
        label: labels.freshGraduate,
        title: labels.professionalProfile,
        strengthsTitle: labels.professionalStrengths,
        ...parseFreshGraduateProfile(experience.profile),
      },
    ];
  }

  return experience.items
    .filter((item) => item.organization || item.jobTitleLabel)
    .map((item, index) => ({
      id: `experience-${index}`,
      label: formatPeriod(
        item.startDate,
        item.currentlyWorking ? '' : item.endDate,
        item.currentlyWorking ? labels.present : '',
      ),
      title: item.jobTitleLabel || item.otherJobTitle,
      description: join([item.organization, item.employmentTypeLabel], ' · '),
      strengthsTitle: '',
      strengths: item.responsibilities
        .map(({ value }) => value)
        .filter(Boolean),
    }));
}

// Maps the wizard values to the shared CV document (employer + candidate views).
export function toCvDocument(
  values: CvBuilderValues,
  labels: CvDocumentLabels,
  locale: string,
): CandidateCv {
  const { personal, contact, jobProfile } = values;
  const formatDate = (date: string) =>
    date
      ? new Intl.DateTimeFormat(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date(date))
      : '';
  const additionalInfo: CandidateCvDetail[] = [
    { key: 'nationality', value: personal.nationalityLabel ?? '' },
    { key: 'year-of-birth', value: personal.yearOfBirth.slice(0, 4) },
    { key: 'marital-status', value: personal.maritalStatus },
  ];

  return {
    name: personal.fullName,
    photo: personal.photo,
    jobTitle: jobProfile.jobTitleLabel ?? '',
    contact: {
      phone: contact.phone,
      email: contact.email,
      location: join([personal.cityLabel ?? '', personal.countryLabel ?? '']),
      linkedin: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ''),
    },
    summary: values.summary.text,
    skills: values.skills.map((skill) => skill.label),
    experiences: toExperiences(values, labels),
    publications: values.research.enabled
      ? values.research.items
          .filter((item) => item.title)
          .map((item, index) => ({
            id: `publication-${index}`,
            title: item.title,
            meta: join([item.countryLabel, item.year], ' · '),
            url: item.link || undefined,
          }))
      : [],
    conferences: values.conferences.enabled
      ? values.conferences.items
          .filter((item) => item.name)
          .map((item, index) => ({
            id: `conference-${index}`,
            title: item.name,
            meta: join([item.location, formatDate(item.date)], ' · '),
          }))
      : [],
    highlights: [
      jobProfile.experienceLabel,
      jobProfile.specialtyLabel && labels.specialty(jobProfile.specialtyLabel),
      jobProfile.subspecialty && labels.subspecialty(jobProfile.subspecialty),
      jobProfile.hasLicense && labels.licensed,
      jobProfile.availableNow && labels.availableNow,
    ].filter((item): item is string => Boolean(item)),
    certifications: values.certificates
      .filter((item) => item.name)
      .map((item, index) => ({
        id: `certification-${index}`,
        title: item.name,
        issuer: item.organization,
        period: formatPeriod(item.startDate, item.endDate),
      })),
    educations: values.educations
      .filter((item) => item.degree || item.university)
      .map((item, index) => ({
        id: `education-${index}`,
        degree: item.degree,
        institution: join([item.university, item.countryLabel]),
        period: formatPeriod(item.startDate, item.endDate),
        gpa: item.gpa,
      })),
    languages: personal.languages
      .filter((item) => item.language)
      .map((item, index) => {
        const known = toLanguageLevel(item.proficiency);
        return {
          id: `language-${index}`,
          name: item.language,
          level: known?.level ?? item.proficiency,
          rating: known?.rating ?? 0,
        };
      }),
    additionalInfo: additionalInfo.filter((detail) => detail.value),
  };
}
