import z from "zod";

export const experienceModalSchema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    otherJobTitle: z.string().trim().optional(),
    organizationOrHospitalName: z
      .string()
      .trim()
      .min(3, "Organization/Hospital Name must be at least 3 characters.")
      .max(100, "Organization/Hospital Name must be at most 100 characters."),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    workHere: z.boolean().default(false),
    responsibilities: z
      .array(
        z.object({
          value: z
            .string()
            .trim()
            .min(3, "Responsibility must be at least 3 characters.")
            .max(255, "Responsibility must be at most 255 characters."),
        }),
      )
      .min(1, "At least one responsibility is required"),
  })
  .refine(
    (data) => data.jobTitle !== "__other__" || Boolean(data.otherJobTitle?.trim()),
    {
      message: "Please enter the other job title.",
      path: ["otherJobTitle"],
    },
  )
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: "Start date must be today or earlier.",
    path: ["startDate"],
  })
  .refine((data) => data.workHere || Boolean(data.endDate), {
    message: "End date is required unless you currently work here.",
    path: ["endDate"],
  })
  .refine(
    (data) => data.workHere || !data.endDate || data.endDate >= data.startDate,
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    },
  );

export type FormData = z.infer<typeof experienceModalSchema>;
