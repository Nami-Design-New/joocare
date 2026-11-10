import { z } from 'zod';

// Every preference is optional in the design, so there are no validation messages.
export const jobPreferencesSchema = z.object({
  domainIds: z.array(z.string()),
  jobFunction: z.string(),
  jobTitleIds: z.array(z.string()),
  companyIds: z.array(z.string()),
  countryIds: z.array(z.string()),
  seniorityLevelIds: z.array(z.string()),
  highMatchOnly: z.boolean(),
});

export type TJobPreferencesSchema = z.infer<typeof jobPreferencesSchema>;
