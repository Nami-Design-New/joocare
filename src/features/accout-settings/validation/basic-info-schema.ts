import { z } from "zod";

export const BasicInfoSchema = z.object({
  companyName: z.string().min(1, { message: "company name is required" }),
  officialEmail: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  domain: z
    .string({
      error: "Domain is required",
    })
    .min(1, { message: "Domain is required" }),
  personFullName: z
    .string()
    .min(1, { message: "Person full name is required" }),
  phoneNumber: z
    .string({
      error: "phone number is required",
    })
    .min(10, { message: "Phone number is required" }),
  orgOfficialPhoneNumber: z
    .string({
      error: "organization official phone number is required",
    })
    .min(10, { message: "organization official phone number is required" }),
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
  dateOfEstablishment: z
    .string()
    .min(1, { message: "Date of establishment is required" }),
});

export type TBasicInfoSchema = z.infer<typeof BasicInfoSchema>;
