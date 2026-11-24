import { mapCertificate } from '@/features/candidate-credentials/services/certificate-utils';
import { mapLicense } from '@/features/candidate-credentials/services/license-utils';
import { mapQualification } from '@/features/candidate-credentials/services/qualification-utils';
import { resolveStorageUrl } from '@/shared/lib/storage-url';
import { MISSING_API_VALUE } from '../constants/project-queries';
import type {
  CandidateProfileApiItem,
  CandidateProfileDetail,
  CandidateProfileLabels,
  CandidateProfilePlaceholder,
  ProjectCandidateProfile,
} from '../types/candidate-profile.types';

type ProfileLookup = { title?: string | null; name?: string | null };

const EMPTY_API_VALUE = '-';

function placeholder(value: null | undefined): CandidateProfilePlaceholder {
  return value === null ? EMPTY_API_VALUE : MISSING_API_VALUE;
}

function firstValue<T>(...values: (T | null | undefined)[]) {
  return (
    values.find((value) => value != null) ??
    (values.includes(null) ? null : undefined)
  );
}

function lookupName(item: ProfileLookup | string | null | undefined) {
  if (item == null || typeof item === 'string') return item;
  return firstValue(item.title, item.name);
}

function display(value: string | null | undefined) {
  return value ?? placeholder(value);
}

function displayList<T>(
  items: T[] | null | undefined,
  map: (item: T) => string,
) {
  return items == null ? placeholder(items) : items.map(map);
}

function displayBoolean(
  value: boolean | null | undefined,
  labels: CandidateProfileLabels,
) {
  return value == null ? placeholder(value) : value ? labels.yes : labels.no;
}

function sectionPlaceholder(items: unknown[] | null | undefined) {
  return items == null ? placeholder(items) : undefined;
}

function displayActiveDate(value: string | null | undefined, locale: string) {
  if (value == null) return placeholder(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

const isPresent = <T>(item: T | null): item is T => item !== null;

function formatMonthYear(value: string | null | undefined, locale: string) {
  if (value == null) return placeholder(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatYear(value: string | null | undefined, locale: string) {
  if (value == null) return placeholder(value);
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

function joinPeriod(start: string, end: string) {
  return start === end ? start : `${start} - ${end}`;
}

// Maps the company view of a candidate profile to the profile page model.
// Fields the API doesn't return show `#`.
export function mapCandidateProfile(
  item: CandidateProfileApiItem,
  labels: CandidateProfileLabels,
): ProjectCandidateProfile {
  const { locale } = labels;
  const fullPhone = item.phone
    ? [item.phone_code, item.phone].filter(Boolean).join(' ')
    : null;
  const location =
    [lookupName(item.city), lookupName(item.country)]
      .filter(Boolean)
      .join(', ') || null;
  const parsedAge = Number.parseInt(String(item.age), 10);
  const age = Number.isNaN(parsedAge) ? null : parsedAge;
  const experience = lookupName(item.experience);
  const preference = item.preference;
  const industry = lookupName(item.domain);
  const jobSearchStatus = item.job_search_status;
  const jobSearchStatusValue =
    typeof jobSearchStatus === 'object' && jobSearchStatus !== null
      ? jobSearchStatus.value
      : jobSearchStatus;
  const details: CandidateProfileDetail[] = [
    { key: 'email', value: display(item.email) },
    {
      key: 'location',
      value:
        location ??
        display(firstValue(lookupName(item.city), lookupName(item.country))),
    },
    { key: 'phone', value: fullPhone ?? display(item.phone) },
    { key: 'experience', value: display(experience) },
    { key: 'specialty', value: display(lookupName(item.specialty)) },
    { key: 'subspecialty', value: display(lookupName(item.subspecialty)) },
    {
      key: 'age',
      value:
        age === null
          ? placeholder(item.age == null ? item.age : null)
          : new Intl.NumberFormat(locale).format(age),
    },
    {
      key: 'gender',
      value: item.gender
        ? labels.value('gender', item.gender)
        : display(item.gender),
    },
    { key: 'religion', value: display(lookupName(item.religion)) },
    {
      key: 'marital-status',
      value: item.marital_status
        ? labels.value('marital', item.marital_status)
        : display(item.marital_status),
    },
  ];
  return {
    profile: {
      id: item.id,
      name: display(item.name),
      email: item.email,
      phone: item.phone,
      phoneCode: item.phone_code,
      fullPhone,
      unread_notifications_count: 0,
      image: resolveStorageUrl(item.image),
      cv: resolveStorageUrl(item.cv),
      bio: display(item.bio),
      age,
      location,
      jobTitle: display(firstValue(lookupName(item.job_title), item.title)),
      experience: experience ?? null,
      isProfileComplete: null,
      skills: (item.skills ?? []).map((skill) => ({
        id: String(skill.id),
        label: display(lookupName(skill)),
      })),
      educations: (item.educations ?? []).map((education) => {
        const startYear = formatYear(education.start_date, locale);
        const endYear = formatYear(education.end_date, locale);
        return {
          id: String(education.id),
          university: display(education.university),
          degree: display(education.degree),
          gpa: display(education.gpa),
          period: joinPeriod(
            formatMonthYear(education.start_date, locale),
            formatMonthYear(education.end_date, locale),
          ),
          educationPeriod: joinPeriod(startYear, endYear),
          countryId: education.country_id ? String(education.country_id) : null,
          startDate: education.start_date,
          endDate: education.end_date,
        };
      }),
      experiences: (item.experiences ?? []).map((entry) => ({
        id: String(entry.id),
        title: display(firstValue(lookupName(entry.job_title), entry.title)),
        organization: display(entry.company),
        startDate: entry.start_date,
        endDate: entry.end_date,
        startDateLabel: formatMonthYear(entry.start_date, locale),
        endDateLabel: entry.is_current
          ? labels.present
          : formatMonthYear(entry.end_date, locale),
        isCurrent: entry.is_current,
        bullets:
          entry.responsibilities == null
            ? [placeholder(entry.responsibilities)]
            : entry.responsibilities.map(({ description }) =>
                display(description),
              ),
      })),
      missing_score_items: [],
    },
    summary: {
      isOpenToWork: jobSearchStatusValue === 'open_to_work',
      openToWorkPlaceholder:
        jobSearchStatusValue == null
          ? placeholder(jobSearchStatusValue)
          : undefined,
      lastActive: displayActiveDate(item.last_active_at, locale),
      details,
      languages: displayList(item.languages, (language) => {
        const name = languageName(language.language, locale);
        const proficiency = language.proficiency_level;
        return `${name} (${proficiency == null ? placeholder(proficiency) : labels.value('proficiency', proficiency)})`;
      }),
      drivingLicense: displayBoolean(item.has_driving_license, labels),
      licenseCountries: displayList(item.driving_license_countries, (country) =>
        display(lookupName(country)),
      ),
    },
    careerPreferences: {
      desiredDesignations: displayList(
        preference === null ? null : preference?.desired_designations,
        (entry) => display(lookupName(entry)),
      ),
      preferredWorkLocations: displayList(
        item.relocation_countries,
        (country) => display(lookupName(country)),
      ),
      desiredIndustries: industry == null ? placeholder(industry) : [industry],
      noticePeriod: display(
        lookupName(preference === null ? null : preference?.notice_period),
      ),
      willingToRelocate: displayBoolean(item.willing_to_relocate, labels),
    },
    clinicalPrivileges: displayList(item.clinical_privileges, (entry) =>
      display(lookupName(entry)),
    ),
    sectionPlaceholders: {
      educations: sectionPlaceholder(item.educations),
      skills: sectionPlaceholder(item.skills),
      experiences: sectionPlaceholder(item.experiences),
      qualifications: sectionPlaceholder(item.qualifications),
      certificates: sectionPlaceholder(item.certifications),
      licenses: sectionPlaceholder(item.licenses),
    },
    qualifications: (item.qualifications ?? [])
      .map((qualification) => {
        const mapped = mapQualification(qualification);
        return mapped
          ? {
              ...mapped,
              degree: display(
                firstValue(
                  qualification.degree,
                  qualification.title,
                  qualification.name,
                ),
              ),
              university: display(
                firstValue(qualification.university, qualification.institution),
              ),
              countryName: display(lookupName(qualification.country)),
              image: resolveStorageUrl(qualification.image),
              period: joinPeriod(
                formatMonthYear(qualification.start_date, locale),
                formatMonthYear(qualification.end_date, locale),
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
              name: display(firstValue(certificate.name, certificate.title)),
              company: display(
                firstValue(
                  certificate.company,
                  certificate.organization,
                  certificate.issuer,
                ),
              ),
              image: resolveStorageUrl(certificate.image),
              period: joinPeriod(
                formatMonthYear(certificate.start_date, locale),
                formatMonthYear(certificate.end_date, locale),
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
              title: display(firstValue(license.title, license.name)),
              countryName: display(lookupName(license.country)),
              number: display(
                firstValue(license.number, license.license_number),
              ),
              image: resolveStorageUrl(license.image),
            }
          : null;
      })
      .filter(isPresent),
  };
}
