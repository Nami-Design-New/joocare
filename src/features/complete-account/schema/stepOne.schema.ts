import { MIN_PHONE_NUMBER_LENGTH } from "@/shared/lib/phone";
import { z } from "zod";

export const stepOneSchema = z.object({
  name: z.string().min(1, { message: "company name is required3333" }),
  email: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  domain_id: z.string().min(1, { message: "Domain is required" }),
  person_name: z
    .string()
    .min(1, { message: "Person full name is required" }),
  person_phone: z
    .string()
    .trim()
    .min(MIN_PHONE_NUMBER_LENGTH, { message: "Phone number is required" }),
});
