import { z } from "zod";

export const RegisterEmployerSchema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "company name is required" })
    .min(3, { message: "company name must be at least 3 characters" })
    .max(100, { message: "company name must be less than 100 characters" }),
  officialEmail: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  domain: z.string({
    message: "Domain is required",
  }).min(1, { message: "Domain is required" }),
  personFullName: z
    .string({
      message: "Person full name is required",
    })
    .nonempty({ message: "Person full name is required" })
    .min(3, { message: "Person full name must be at least 3 characters" })
    .max(100, { message: "Person full name must be less than 100 characters" }),
  phoneNumber: z.string({
    message: "Phone number is required",
  }).min(7, { message: "Phone number is required" })
    .max(15, { message: "Phone number must be less than 15 characters" }),
  createPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(15, { message: "Password must be less than 15 characters" }),
  confirmRegister: z.boolean({
    message: "You must confirm that you are authorized to represent this company",
  }).refine((val) => val === true, {
    message: "You must confirm that you are authorized to represent this company",
  }),
  termsAndConditions: z.boolean({
    message: "You must accept the Privacy Policy and Terms & Conditions",
  }).refine((val) => val === true, {
    message: "You must accept the Privacy Policy and Terms & Conditions",
  }),
});

export type TRegisterEmployerSchema = z.infer<typeof RegisterEmployerSchema>;
