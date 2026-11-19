import type {
  CvBuilderRemoteData,
  CvBuilderSummary,
  CvBuilderValues,
} from '../types/cv-builder.types';
import {
  emptyCertificate,
  emptyConference,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyPublication,
  getEmptyCvValues,
} from './cv-builder-defaults';

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

function asRecords(value: unknown) {
  const record = asRecord(value);
  if (record) return [record];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = asRecord(item);
    return record ? [record] : [];
  });
}

function asString(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function asBoolean(value: unknown) {
  return value === true || value === 1 || value === '1';
}

function getValue(record: ApiRecord, ...keys: string[]) {
  for (const key of keys) {
    if (key in record) return record[key];
  }
  return undefined;
}

function getId(record: ApiRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    const nested = asRecord(value);
    const id = asString(nested?.id ?? value);

    if (id) return id;
  }

  return '';
}

function toMonth(value: unknown) {
  const date = asString(value);
  return /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : '';
}

function formatSavedAt(value: unknown, locale: string) {
  const rawDate = asString(value);
  const date = new Date(rawDate);

  if (!rawDate || Number.isNaN(date.getTime())) return rawDate;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date);
}

function toCompletedStepCount(value: unknown) {
  if (Array.isArray(value)) {
    return new Set(
      value
        .map((step) => Number(step))
        .filter((step) => Number.isInteger(step) && step > 0),
    ).size;
  }

  const completed = Number(value);
  return Number.isFinite(completed) ? completed : 0;
}

function toCurrentStep(value: unknown, totalSteps: number) {
  const step = Number(value);

  if (!Number.isInteger(step) || step < 1) return 1;
  return Math.min(step, totalSteps);
}

function unwrapData(value: unknown) {
  const root = asRecord(value);
  if (!root) return null;
  return 'data' in root ? asRecord(root.data) : root;
}

// Some payloads return the CV plus its related collections as siblings, so keep
// any key the CV object does not already have (skills, languages, education...).
function mergeMissingKeys(target: ApiRecord, source: ApiRecord | null) {
  if (!source) return target;

  const merged = { ...target };

  for (const [key, entry] of Object.entries(source)) {
    if (!(key in merged)) merged[key] = entry;
  }

  return merged;
}

function unwrapCvData(value: unknown) {
  const root = asRecord(value);
  if (!root) return null;

  const data = unwrapData(value);
  if (!data) return null;

  const cv = 'cv' in data ? asRecord(data.cv) : data;
  if (!cv) return null;

  return mergeMissingKeys(mergeMissingKeys(cv, data), root);
}

function lookupLabel(value: unknown) {
  const record = asRecord(value);
  return asString(record?.title ?? record?.name ?? record?.label);
}

function mapLanguages(value: unknown) {
  const languages = asRecords(value).map((language) => ({
    language: asString(getValue(language, 'language', 'title', 'name')),
    proficiency: asString(
      getValue(language, 'proficiency_level', 'proficiency'),
    ),
  }));

  return languages.length ? languages : [emptyLanguage()];
}

// Saved skills come back as rows with the skill in a nested `skill` object; the
// row id is the pivot id, so prefer the real skill id for saving. Rows without a
// lookup skill are custom skills, rebuilt from their title.
function mapSkills(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const record = asRecord(item);
    const skill = asRecord(record?.skill);
    const skillId =
      (record ? getId(record, 'skill_id') : '') || getId(skill ?? {}, 'id');
    const label =
      asString(record ? getValue(record, 'display_title') : '') ||
      asString(record ? getValue(record, 'skill_title') : '') ||
      lookupLabel(skill) ||
      lookupLabel(record);
    const id =
      skillId ||
      (record ? getId(record, 'id') : asString(item)) ||
      (label ? `custom-${label}` : '');

    if (!id) return [];

    return [{ id, label, ...(skillId ? {} : { isCustom: true }) }];
  });
}

function mapValues(record: ApiRecord): CvBuilderValues {
  const values = getEmptyCvValues();
  const personal = asRecord(getValue(record, 'personal', 'personal_details'));
  const contact = asRecord(getValue(record, 'contact', 'contact_info'));
  const jobProfile = asRecord(getValue(record, 'job_profile', 'jobProfile'));
  const source = (key: string) => personal?.[key] ?? record[key];
  const contactSource = (key: string) => contact?.[key] ?? record[key];
  const jobSource = (key: string) => jobProfile?.[key] ?? record[key];
  const phone = asString(contactSource('phone'));
  const phoneCode = asString(contactSource('phone_code'));

  values.personal = {
    photo: asString(source('image')),
    fullName: asString(source('name')),
    nationality:
      getId(record, 'nationality_id') ||
      getId(personal ?? {}, 'nationality_id'),
    nationalityLabel: lookupLabel(source('nationality')),
    yearOfBirth: asString(source('birth_date') ?? source('date_of_birth')),
    maritalStatus: asString(source('marital_status')),
    country: getId(record, 'country_id') || getId(personal ?? {}, 'country_id'),
    countryLabel: lookupLabel(source('country')),
    city: getId(record, 'city_id') || getId(personal ?? {}, 'city_id'),
    cityLabel: lookupLabel(source('city')),
    languages: mapLanguages(source('languages')),
  };
  values.contact = {
    email: asString(contactSource('email')),
    phone:
      phoneCode && phone && !phone.startsWith('+')
        ? `${phoneCode}${phone}`
        : phone,
    linkedin: asString(contactSource('linkedin')),
  };
  values.jobProfile = {
    jobTitle:
      getId(record, 'job_title_id') || getId(jobProfile ?? {}, 'job_title_id'),
    jobTitleLabel:
      lookupLabel(jobSource('job_title_relation')) ||
      lookupLabel(jobSource('job_title')),
    yearsOfExperience:
      getId(record, 'experience_id') ||
      getId(jobProfile ?? {}, 'experience_id'),
    specialty:
      getId(record, 'specialty_id') || getId(jobProfile ?? {}, 'specialty_id'),
    specialtyLabel: lookupLabel(jobSource('specialty')),
    subspecialty: asString(
      jobSource('subspecialty_title') ?? jobSource('sub_specialty_title'),
    ),
    hasLicense: asBoolean(jobSource('has_professional_license')),
    availableNow: asBoolean(jobSource('is_available_now')),
  };
  values.summary = {
    text: asString(getValue(record, 'professional_summary', 'summary')),
  };

  const education = asRecords(getValue(record, 'education', 'educations')).map(
    (entry) => ({
      degree: asString(entry.degree),
      university: asString(entry.university),
      country:
        getId(entry, 'country_id') ||
        getId(asRecord(entry.country) ?? {}, 'id'),
      countryLabel:
        lookupLabel(entry.country) ||
        (typeof entry.country === 'string' ? entry.country : '') ||
        asString(getValue(entry, 'country_name', 'country_title')),
      startDate: toMonth(entry.start_date),
      endDate: toMonth(entry.end_date),
      gpa: asString(entry.gpa),
    }),
  );
  values.educations = education.length ? education : [emptyEducation()];

  const certificates = asRecords(getValue(record, 'certificates')).map(
    (entry) => ({
      name: asString(entry.name),
      organization: asString(getValue(entry, 'company', 'organization')),
      startDate: toMonth(entry.start_date),
      endDate: toMonth(entry.end_date),
    }),
  );
  values.certificates = certificates.length
    ? certificates
    : [emptyCertificate()];

  const fresher = asBoolean(getValue(record, 'is_fresher', 'fresh_graduate'));
  const experiences = asRecords(getValue(record, 'experiences')).map(
    (entry) => ({
      ...emptyExperience(),
      jobTitle: getId(entry, 'job_title_id'),
      otherJobTitle: asString(entry.title),
      organization: asString(getValue(entry, 'company', 'organization')),
      employmentType: getId(entry, 'employment_type_id'),
      startDate: toMonth(entry.start_date),
      endDate: toMonth(entry.end_date),
      currentlyWorking: asBoolean(entry.is_current),
      responsibilities: asRecords(entry.responsibilities).map((item) => ({
        value: asString(getValue(item, 'responsibility', 'description')),
      })),
    }),
  );
  values.experience = {
    freshGraduate: fresher,
    profile: asString(
      getValue(record, 'fresher_bio', 'fresh_graduate_profile'),
    ),
    items: experiences.length ? experiences : [emptyExperience()],
  };

  values.skills = mapSkills(getValue(record, 'skills'));

  const researches = asRecords(getValue(record, 'researches', 'research')).map(
    (entry) => ({
      title: asString(entry.title),
      link: asString(entry.link),
      country: getId(entry, 'country_id'),
      year: asString(entry.year),
    }),
  );
  values.research = {
    enabled:
      asBoolean(getValue(record, 'has_researches')) || researches.length > 0,
    items: researches.length ? researches : [emptyPublication()],
  };

  const conferences = asRecords(getValue(record, 'conferences')).map(
    (entry) => ({
      name: asString(getValue(entry, 'title', 'name')),
      location: asString(entry.location),
      date: asString(entry.date),
    }),
  );
  values.conferences = {
    enabled:
      asBoolean(getValue(record, 'has_conferences')) || conferences.length > 0,
    items: conferences.length ? conferences : [emptyConference()],
  };

  return values;
}

function toSummary(
  record: ApiRecord,
  progress: ApiRecord | null,
  totalSteps: number,
  locale: string,
): CvBuilderSummary {
  const completed = toCompletedStepCount(
    getValue(
      progress ?? {},
      'completed_steps',
      'completedSteps',
      'current_step',
    ),
  );

  return {
    lastSavedAt: formatSavedAt(
      getValue(record, 'updated_at', 'created_at'),
      locale,
    ),
    completedSteps: Math.min(Math.max(completed, 0), totalSteps),
    totalSteps,
  };
}

export function mapCvBuilderRemoteData(
  cvResponse: unknown,
  progressResponse: unknown,
  totalSteps: number,
  locale: string,
): CvBuilderRemoteData {
  const cv = unwrapCvData(cvResponse);
  const progress = unwrapData(progressResponse);

  if (!cv) {
    return {
      state: 'intro',
      summary: { lastSavedAt: '', completedSteps: 0, totalSteps },
      currentStep: 1,
      values: null,
    };
  }

  const summary = toSummary(cv, progress, totalSteps, locale);
  const completed =
    asBoolean(getValue(cv, 'is_completed', 'completed')) ||
    summary.completedSteps >= totalSteps;

  return {
    state: completed ? 'exists' : 'draft',
    summary: {
      ...summary,
      completedSteps: completed ? totalSteps : summary.completedSteps,
    },
    currentStep: toCurrentStep(
      getValue(progress ?? {}, 'current_step', 'currentStep'),
      totalSteps,
    ),
    values: mapValues(cv),
  };
}
