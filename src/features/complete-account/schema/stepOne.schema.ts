import { z } from "zod";

export const stepOneSchema = z.object({
  companyName: z.string().min(1, { message: "company name is required" }),
  officialEmail: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  domain: z.string().min(1, { message: "Domain is required" }),
  personFullName: z
    .string()
    .min(1, { message: "Person full name is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
});
