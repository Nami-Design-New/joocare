import { z } from "zod";

export const SettingBasicInfoSchema = z.object({
  fullName: z.string().min(1, { message: "full name is required" }),
  email: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  phoneNumber: z
    .string({
      error: "phone number is required",
    })
    .min(10, { message: "Phone number is required" }),

  jobTitle: z
    .string({
      error: "job title is required",
    })
    .min(1, { message: "job title is required" }),

  specialty: z
    .string({
      error: "specialty is required",
    })
    .min(1, { message: "specialty is required" }),

  yearsOfExperience: z
    .string({
      error: "years of experience is required",
    })
    .min(1, { message: "years of experience is required" }),

  country: z
    .string({
      error: "Country is required",
    })
    .min(1, { message: "Country is required" }),

  city: z
    .string({
      error: "City is required",
    })
    .min(1, { message: "City is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  uploadCV: z.array(z.instanceof(File)).optional().default([]),
});

export type TSettingBasicInfoSchema = z.infer<typeof SettingBasicInfoSchema>;
