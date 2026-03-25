import z from "zod";

export const experienceModalSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  organizationOrHospitalName: z.string().min(1, "Organization is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  workHere: z.boolean().optional(),
  responsibilities: z
    .array(
      z.object({
        value: z.string().min(1, "Required"),
      }),
    )
    .min(1),
});

export type FormData = z.infer<typeof experienceModalSchema>;
