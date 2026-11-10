import { z } from 'zod';

const yesNo = z.enum(['yes', 'no', '']);
// Empty or a non-negative number.
const AMOUNT_PATTERN = /^\d*(\.\d+)?$/;

export function createAdditionalInfoSchema(messages: {
  invalidAmount: string;
  salaryRange: string;
}) {
  const salary = z.string().regex(AMOUNT_PATTERN, messages.invalidAmount);

  return z
    .object({
      // Qualifications & Expertise
      yearsInRole: z.string(),
      seniorityLevel: z.string(),
      educationLevel: z.string(),
      certifications: z.array(z.string()),
      professionalLicense: z.string(),
      licenseCountry: z.string(),
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
      jobSearchStatus: z.enum([
        'open-to-work',
        'actively-looking',
        'open-to-opportunities',
      ]),
      // Professional information
      clinicalPrivileges: z.array(z.string()),
      // Personal details
      nationality: z.string(),
      currentCountry: z.string(),
      visaStatus: z.string(),
      gender: z.string(),
      currentCity: z.string(),
      sponsorship: z.string(),
      maritalStatus: z.string(),
      // Salary
      currentSalary: salary,
      currentCurrency: z.string(),
      expectedMin: salary,
      expectedMax: salary,
      expectedCurrency: z.string(),
    })
    .superRefine((values, context) => {
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
