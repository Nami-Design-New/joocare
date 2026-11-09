import { z } from 'zod';
import { isValidGpa } from '@/shared/lib/gpa';

const URL_PATTERN = /^https?:\/\/\S+\.\S+$/;

type CvBuilderSchemaMessages = {
  required: string;
  invalidEmail: string;
  invalidUrl: string;
  invalidGpa: string;
};

// One schema for the whole wizard; each step validates its own key (see CV_BUILDER_STEPS).
export function createCvBuilderSchema(messages: CvBuilderSchemaMessages) {
  const required = z.string().trim().min(1, messages.required);
  const optional = z.string();
  const optionalUrl = z
    .string()
    .trim()
    .refine((value) => !value || URL_PATTERN.test(value), messages.invalidUrl);

  const language = z.object({ language: optional, proficiency: optional });
  const education = z.object({
    degree: required,
    university: required,
    country: optional,
    startDate: optional,
    endDate: optional,
    gpa: required.refine(isValidGpa, messages.invalidGpa),
  });
  const certificate = z.object({
    name: required,
    organization: optional,
    startDate: optional,
    endDate: optional,
  });
  const experienceItem = z.object({
    jobTitle: optional,
    otherJobTitle: optional,
    organization: optional,
    employmentType: optional,
    startDate: optional,
    endDate: optional,
    currentlyWorking: z.boolean(),
    responsibilities: z.array(z.object({ value: optional })),
  });
  const publication = z.object({
    title: optional,
    link: optionalUrl,
    country: optional,
    year: optional,
  });
  const conference = z.object({
    name: optional,
    location: optional,
    date: optional,
  });

  return z.object({
    personal: z.object({
      photo: optional,
      fullName: required,
      nationality: optional,
      yearOfBirth: optional,
      maritalStatus: optional,
      country: optional,
      city: optional,
      languages: z.array(language),
    }),
    contact: z.object({
      email: z.string().trim().email(messages.invalidEmail),
      phone: optional,
      linkedin: optionalUrl,
    }),
    jobProfile: z.object({
      jobTitle: required,
      yearsOfExperience: optional,
      specialty: optional,
      subspecialty: optional,
      hasLicense: z.boolean(),
      availableNow: z.boolean(),
    }),
    summary: z.object({ text: required }),
    educations: z.array(education),
    certificates: z.array(certificate),
    experience: z
      .object({
        freshGraduate: z.boolean(),
        profile: optional,
        items: z.array(experienceItem),
      })
      .superRefine((value, context) => {
        // Work experience is required unless the candidate is a fresh graduate.
        if (value.freshGraduate) return;
        value.items.forEach((item, index) => {
          if (!item.organization.trim()) {
            context.addIssue({
              code: 'custom',
              path: ['items', index, 'organization'],
              message: messages.required,
            });
          }
        });
      }),
    skills: z.array(z.string()),
    research: z
      .object({ enabled: z.boolean(), items: z.array(publication) })
      .superRefine((value, context) => {
        if (!value.enabled) return;
        value.items.forEach((item, index) => {
          if (!item.title.trim()) {
            context.addIssue({
              code: 'custom',
              path: ['items', index, 'title'],
              message: messages.required,
            });
          }
        });
      }),
    conferences: z
      .object({ enabled: z.boolean(), items: z.array(conference) })
      .superRefine((value, context) => {
        if (!value.enabled) return;
        value.items.forEach((item, index) => {
          if (!item.name.trim()) {
            context.addIssue({
              code: 'custom',
              path: ['items', index, 'name'],
              message: messages.required,
            });
          }
        });
      }),
  });
}
