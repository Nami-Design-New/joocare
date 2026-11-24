import { mapCertificate } from '@/features/candidate-credentials/services/certificate-utils';
import { mapLicense } from '@/features/candidate-credentials/services/license-utils';
import { mapQualification } from '@/features/candidate-credentials/services/qualification-utils';
import { resolveStorageUrl } from '@/shared/lib/storage-url';
import { MISSING_API_VALUE } from '../constants/project-queries';
import type {
  CandidateProfileApiItem,
  CandidateProfileDetail,
  CandidateProfileLabels,
  ProjectCandidateProfile,
} from '../types/candidate-profile.types';

type ProfileLookup = { title?: string | null; name?: string | null } | null;

const lookupName = (item: ProfileLookup) => item?.title ?? item?.name ?? null;

const isPresent = <T>(item: T | null): item is T => item !== null;

function formatMonthYear(value: string | null, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatYear(value: string | null, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
}

function languageName(code: string, locale: string) {
  try {
    return (
      new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? code
    );
  } catch {
    return code;
  }
}

function joinPeriod(start: string | null, end: string | null) {
  return start && end ? `${start} - ${end}` : (start ?? end ?? null);
}

// Maps the company view of a candidate profile to the profile page model.
// Fields the API doesn't return show `#`.
export function mapCandidateProfile(
  item: CandidateProfileApiItem,
  labels: CandidateProfileLabels,
): ProjectCandidateProfile {
  const { locale } = labels;
  const fullPhone =
    [item.phone_code, item.phone].filter(Boolean).join(' ') || null;
  const location =
    [lookupName(item.city), lookupName(item.country)]
      .filter(Boolean)
      .join(', ') || null;
  const age = item.age === null ? null : Number.parseInt(String(item.age), 10);
  const experience = lookupName(item.experience);
  const details: CandidateProfileDetail[] = [
    { key: 'email', value: item.email },
    { key: 'location', value: location ?? '-' },
    { key: 'phone', value: fullPhone ?? '-' },
    { key: 'experience', value: experience ?? '-' },
    { key: 'specialty', value: lookupName(item.specialty) ?? '-' },
    { key: 'subspecialty', value: lookupName(item.subspecialty) ?? '-' },
    { key: 'age', value: age && !Number.isNaN(age) ? String(age) : '-' },
    {
      key: 'gender',
      value: item.gender ? labels.value('gender', item.gender) : '-',
    },
    { key: 'religion', value: lookupName(item.religion) ?? '-' },
    {
      key: 'marital-status',
      value: item.marital_status
        ? labels.value('marital', item.marital_status)
        : '-',
    },
  ];
  const drivingCountries = (item.driving_license_countries ?? [])
    .map(lookupName)
    .filter(isPresent);
  const relocationCountries = (item.relocation_countries ?? [])
    .map(lookupName)
    .filter(isPresent);

  return {
    profile: {
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      phoneCode: item.phone_code,
      fullPhone,
      unread_notifications_count: 0,
      image: resolveStorageUrl(item.image),
      cv: resolveStorageUrl(item.cv),
      bio: item.bio,
      age: age && !Number.isNaN(age) ? age : null,
      location,
      jobTitle: lookupName(item.job_title) ?? item.title,
      experience,
      isProfileComplete: null,
      skills: (item.skills ?? []).map((skill) => ({
        id: String(skill.id),
        label: lookupName(skill) ?? MISSING_API_VALUE,
      })),
      educations: (item.educations ?? []).map((education) => {
        const startYear = formatYear(education.start_date, locale);
        const endYear = education.end_date
          ? formatYear(education.end_date, locale)
          : labels.present;
        return {
          id: String(education.id),
          university: education.university ?? MISSING_API_VALUE,
          degree: education.degree,
          gpa: education.gpa,
          period: joinPeriod(
            formatMonthYear(education.start_date, locale),
            education.end_date
              ? formatMonthYear(education.end_date, locale)
              : labels.present,
          ),
          educationPeriod: joinPeriod(startYear, endYear),
          countryId: education.country_id ? String(education.country_id) : null,
          startDate: education.start_date,
          endDate: education.end_date,
        };
      }),
      // Experiences come with `job_title_id` only, so the title may be `#`.
      experiences: (item.experiences ?? []).map((entry) => ({
        id: String(entry.id),
        title:
          lookupName(entry.job_title ?? null) ??
          entry.title ??
          MISSING_API_VALUE,
        organization: entry.company,
        startDate: entry.start_date,
        endDate: entry.end_date,
        startDateLabel: formatMonthYear(entry.start_date, locale),
        endDateLabel: entry.is_current
          ? labels.present
          : formatMonthYear(entry.end_date, locale),
        isCurrent: entry.is_current,
        bullets: (entry.responsibilities ?? [])
          .map((responsibility) => responsibility.description)
          .filter(Boolean),
      })),
      missing_score_items: [],
    },
    summary: {
      // No "open to work" / "last active" in the API yet.
      isOpenToWork: false,
      lastActive: null,
      details,
      languages: (item.languages ?? []).map((language) => {
        const name = languageName(language.language, locale);
        return language.proficiency_level
          ? `${name} (${labels.value('proficiency', language.proficiency_level)})`
          : name;
      }),
      drivingLicense: drivingCountries.length ? labels.yes : labels.no,
      licenseCountries: drivingCountries,
    },
    careerPreferences: {
      desiredDesignations: [],
      preferredWorkLocations: relocationCountries,
      desiredIndustries: [],
      noticePeriod: MISSING_API_VALUE,
      willingToRelocate: relocationCountries.length ? labels.yes : labels.no,
    },
    clinicalPrivileges: (item.clinical_privileges ?? [])
      .map(lookupName)
      .filter(isPresent),
    qualifications: (item.qualifications ?? [])
      .map((qualification) => {
        const mapped = mapQualification(qualification);
        return mapped
          ? {
              ...mapped,
              degree:
                qualification.degree ??
                qualification.title ??
                qualification.name ??
                MISSING_API_VALUE,
              university:
                qualification.university ??
                qualification.institution ??
                MISSING_API_VALUE,
              image: resolveStorageUrl(qualification.image),
              period: joinPeriod(
                formatMonthYear(qualification.start_date ?? null, locale),
                qualification.end_date
                  ? formatMonthYear(qualification.end_date, locale)
                  : labels.present,
              ),
            }
          : null;
      })
      .filter(isPresent),
    certificates: (item.certifications ?? [])
      .map((certificate) => {
        const mapped = mapCertificate(certificate);
        return mapped
          ? {
              ...mapped,
              name: certificate.name ?? certificate.title ?? MISSING_API_VALUE,
              company:
                certificate.company ??
                certificate.organization ??
                certificate.issuer ??
                MISSING_API_VALUE,
              image: resolveStorageUrl(certificate.image),
              period: joinPeriod(
                formatMonthYear(certificate.start_date ?? null, locale),
                certificate.end_date
                  ? formatMonthYear(certificate.end_date, locale)
                  : labels.present,
              ),
            }
          : null;
      })
      .filter(isPresent),
    licenses: (item.licenses ?? [])
      .map((license) => {
        const mapped = mapLicense(license);
        return mapped
          ? {
              ...mapped,
              title: license.title ?? license.name ?? MISSING_API_VALUE,
              number:
                license.number ?? license.license_number ?? MISSING_API_VALUE,
              image: resolveStorageUrl(license.image),
            }
          : null;
      })
      .filter(isPresent),
  };
}
