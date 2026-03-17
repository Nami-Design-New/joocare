import { z } from "zod";

export const RegisterEmployerSchema = z.object({
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
  createPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be less than 21 characters" }),
  confirmRegister: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

export type TRegisterEmployerSchema = z.infer<typeof RegisterEmployerSchema>;
