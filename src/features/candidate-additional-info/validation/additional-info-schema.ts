import { z } from 'zod';
import { OTHER_OPTION } from '../constants';

const yesNo = z.enum(['yes', 'no', '']);
// Empty or a non-negative number.
const AMOUNT_PATTERN = /^\d*(\.\d+)?$/;

export function createAdditionalInfoSchema(messages: {
  invalidAmount: string;
  salaryRange: string;
  otherRequired: string;
}) {
  const salary = z.string().regex(AMOUNT_PATTERN, messages.invalidAmount);

  return z
    .object({
      // Qualifications & Expertise
      yearsInRole: z.string(),
      seniorityLevel: z.string(),
      educationLevel: z.string(),
      certifications: z.array(z.string()),
      otherCertification: z.string(),
      professionalLicense: z.string(),
      professionalLicenseCountries: z.array(z.string()),
      otherLicenseCountry: z.string(),
      licenseStatus: z.string(),
      verificationStatus: z.string(),
      // Languages
      languages: z.array(
        z.object({ language: z.string(), proficiency: z.string() }),
      ),
      // Mobility
      relocation: yesNo,
      preferredCountries: z.array(z.string()),
      drivingLicense: yesNo,
      licenseCountries: z.array(z.string()),
      // Career preferences
      designations: z.array(z.string()),
      workLocations: z.array(z.string()),
      industries: z.array(z.string()),
      noticePeriod: z.string(),
      jobSearchStatus: z.string(),
      // Professional information
      clinicalPrivileges: z.array(z.string()),
      // Personal details
      nationality: z.string(),
      currentCountry: z.string(),
      visaStatus: z.string(),
      gender: z.string(),
      currentCity: z.string(),
      sponsorship: z.array(z.string()),
      maritalStatus: z.string(),
      religion: z.string(),
      // Salary
      currentSalary: salary,
      currentCurrency: z.string(),
      expectedMin: salary,
      expectedMax: salary,
      expectedCurrency: z.string(),
    })
    .superRefine((values, context) => {
      const otherFields = [
        ['certifications', 'otherCertification'],
        ['professionalLicenseCountries', 'otherLicenseCountry'],
      ] as const;
      otherFields.forEach(([listName, otherName]) => {
        if (
          values[listName].includes(OTHER_OPTION) &&
          !values[otherName].trim()
        ) {
          context.addIssue({
            code: 'custom',
            path: [otherName],
            message: messages.otherRequired,
          });
        }
      });
      if (
        values.expectedMin &&
        values.expectedMax &&
        Number(values.expectedMin) > Number(values.expectedMax)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['expectedMax'],
          message: messages.salaryRange,
        });
      }
    });
}

export type TAdditionalInfoSchema = z.infer<
  ReturnType<typeof createAdditionalInfoSchema>
>;
