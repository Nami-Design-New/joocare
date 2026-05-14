import { MIN_PHONE_NUMBER_LENGTH } from "@/shared/lib/phone";
import { z } from "zod";

type CreateBasicInfoSchemaOptions = {
  messages?: {
    companyNameRequired: string;
    officialEmailRequired: string;
    officialEmailInvalid: string;
    domainRequired: string;
    personFullNameRequired: string;
    phoneNumberRequired: string;
    countryRequired: string;
    cityRequired: string;
    dateOfEstablishmentRequired: string;
  };
};

export const createBasicInfoSchema = ({ messages }: CreateBasicInfoSchemaOptions = {}) =>
  z.object({
    companyName: z
      .string()
      .min(1, { message: messages?.companyNameRequired ?? "Company name is required" }),
    officialEmail: z
      .string()
      .min(1, { message: messages?.officialEmailRequired ?? "Email is required" })
      .email({ message: messages?.officialEmailInvalid ?? "Not a valid email" }),
    domain: z
      .string({
        error: messages?.domainRequired ?? "Domain is required",
      })
      .min(1, { message: messages?.domainRequired ?? "Domain is required" }),
    personFullName: z
      .string()
      .min(1, { message: messages?.personFullNameRequired ?? "Contact person full name is required" }),
    phoneNumber: z
      .string({
        error: messages?.phoneNumberRequired ?? "Phone number is required",
      })
      .trim()
      .min(MIN_PHONE_NUMBER_LENGTH, { message: messages?.phoneNumberRequired ?? "Phone number is required" }),
    orgOfficialPhoneNumber: z.string().optional(),
    country: z
      .string({
        error: messages?.countryRequired ?? "Country is required",
      })
      .min(1, { message: messages?.countryRequired ?? "Country is required" }),
    city: z
      .string({
        error: messages?.cityRequired ?? "City is required",
      })
      .min(1, { message: messages?.cityRequired ?? "City is required" }),
    dateOfEstablishment: z
      .string()
      .min(1, { message: messages?.dateOfEstablishmentRequired ?? "Date of establishment is required" }),
  });

export const BasicInfoSchema = createBasicInfoSchema();

export type TBasicInfoSchema = z.infer<typeof BasicInfoSchema>;
