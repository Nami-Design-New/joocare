import { parsePhoneNumber } from 'react-phone-number-input';
import type { CvBuilderValues } from '../types/cv-builder.types';

export class CvStepPayloadError extends Error {
  constructor() {
    super('Invalid selection');
    this.name = 'CvStepPayloadError';
  }
}

function toId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new CvStepPayloadError();
  return id;
}

function date(value: string) {
  return value ? `${value}-01` : undefined;
}

function text(value: string) {
  return value.trim();
}

export function buildCvStepPayload(step: number, values: CvBuilderValues) {
  switch (step) {
    case 1:
      return {
        name: text(values.personal.fullName),
        ...(text(values.personal.photo)
          ? { image: text(values.personal.photo) }
          : {}),
        nationality_id: toId(values.personal.nationality),
        ...(values.personal.yearOfBirth
          ? { birth_date: values.personal.yearOfBirth }
          : {}),
        ...(values.personal.maritalStatus
          ? { marital_status: values.personal.maritalStatus.toLowerCase() }
          : {}),
        country_id: toId(values.personal.country),
        city_id: toId(values.personal.city),
        languages: values.personal.languages
          .filter((item) => item.language && item.proficiency)
          .map((item) => ({
            language: item.language,
            proficiency_level: item.proficiency.toLowerCase(),
          })),
      };
    case 2: {
      const phone = values.contact.phone
        ? parsePhoneNumber(values.contact.phone)
        : undefined;
      return {
        email: text(values.contact.email),
        ...(phone?.nationalNumber ? { phone: phone.nationalNumber } : {}),
        ...(phone?.countryCallingCode
          ? { phone_code: `+${phone.countryCallingCode}` }
          : {}),
        ...(text(values.contact.linkedin)
          ? { linkedin: text(values.contact.linkedin) }
          : {}),
      };
    }
    case 3:
      return {
        job_title_id: toId(values.jobProfile.jobTitle),
        ...(values.jobProfile.yearsOfExperience
          ? { experience_id: toId(values.jobProfile.yearsOfExperience) }
          : {}),
        ...(values.jobProfile.specialty
          ? { specialty_id: toId(values.jobProfile.specialty) }
          : {}),
        ...(text(values.jobProfile.subspecialty)
          ? {
              sub_specialty_title: text(values.jobProfile.subspecialty),
            }
          : {}),
        has_professional_license: values.jobProfile.hasLicense,
        is_available_now: values.jobProfile.availableNow,
      };
    case 4:
      return { professional_summary: text(values.summary.text) };
    case 5:
      return {
        education: values.educations
          .filter((item) => text(item.degree) || text(item.university))
          .map((item) => ({
            degree: text(item.degree),
            university: text(item.university),
            gpa: text(item.gpa),
            ...(item.country ? { country_id: toId(item.country) } : {}),
            ...(date(item.startDate)
              ? { start_date: date(item.startDate) }
              : {}),
            ...(date(item.endDate) ? { end_date: date(item.endDate) } : {}),
          })),
      };
    case 6:
      return {
        certificates: values.certificates
          .filter((item) => text(item.name))
          .map((item) => ({
            name: text(item.name),
            ...(text(item.organization)
              ? { company: text(item.organization) }
              : {}),
            ...(date(item.startDate)
              ? { start_date: date(item.startDate) }
              : {}),
            ...(date(item.endDate) ? { end_date: date(item.endDate) } : {}),
          })),
      };
    case 7:
      return values.experience.freshGraduate
        ? { is_fresher: true, fresher_bio: text(values.experience.profile) }
        : {
            is_fresher: false,
            experiences: values.experience.items
              .filter((item) => text(item.organization))
              .map((item) => ({
                title: text(item.otherJobTitle) || item.jobTitle,
                job_title_id: toId(item.jobTitle),
                company: text(item.organization),
                ...(date(item.startDate)
                  ? { start_date: date(item.startDate) }
                  : {}),
                ...(item.currentlyWorking
                  ? { end_date: null }
                  : date(item.endDate)
                    ? { end_date: date(item.endDate) }
                    : {}),
                is_current: item.currentlyWorking,
                employment_type_id: toId(item.employmentType),
                responsibilities: item.responsibilities
                  .filter((entry) => text(entry.value))
                  .map((entry) => ({ responsibility: text(entry.value) })),
              })),
          };
    case 8:
      return {
        skills: values.skills
          .filter((skill) => text(skill.label))
          .map((skill) => {
            const id = Number(skill.id);
            const isChosen =
              !skill.isCustom && Number.isInteger(id) && id > 0;

            // Chosen suggestions send their lookup id; "add another" sends a title.
            return isChosen
              ? { skill_id: id }
              : { skill_title: text(skill.label) };
          }),
      };
    case 9:
      return values.research.enabled
        ? {
            has_researches: true,
            researches: values.research.items
              .filter((item) => text(item.title))
              .map((item) => ({
                title: text(item.title),
                ...(text(item.link) ? { link: text(item.link) } : {}),
                ...(item.country ? { country_id: toId(item.country) } : {}),
                ...(item.year ? { year: item.year } : {}),
              })),
          }
        : { has_researches: false };
    case 10:
      return values.conferences.enabled
        ? {
            has_conferences: true,
            conferences: values.conferences.items
              .filter((item) => text(item.name))
              .map((item) => ({
                title: text(item.name),
                ...(text(item.location)
                  ? { location: text(item.location) }
                  : {}),
                ...(item.date ? { date: item.date } : {}),
              })),
          }
        : { has_conferences: false };
    default:
      throw new CvStepPayloadError();
  }
}
