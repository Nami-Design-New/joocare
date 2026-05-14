import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

type CreateLicenseSchemaOptions = {
  requireImage?: boolean;
  messages?: {
    titleMin: string;
    titleMax: string;
    numberMin: string;
    numberMax: string;
    countryRequired: string;
    imageRequired: string;
    oneImageOnly: string;
    imageType: string;
    imageSize: string;
  };
};

export const createLicenseSchema = ({
  requireImage = true,
  messages,
}: CreateLicenseSchemaOptions = {}) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(3, messages?.titleMin ?? "License title must be at least 3 characters.")
      .max(100, messages?.titleMax ?? "License title must be at most 100 characters."),
    number: z
      .string()
      .trim()
      .min(3, messages?.numberMin ?? "License number must be at least 3 characters.")
      .max(100, messages?.numberMax ?? "License number must be at most 100 characters."),
    countryId: z.string().trim().min(1, messages?.countryRequired ?? "Country is required."),
    image: z
      .array(z.instanceof(File))
      .min(requireImage ? 1 : 0, messages?.imageRequired ?? "License image is required.")
      .max(1, messages?.oneImageOnly ?? "Only one image is allowed.")
      .default([])
      .refine(
        (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
        messages?.imageType ?? "License image must be JPG or PNG.",
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
        messages?.imageSize ?? "License image size must not exceed 2MB.",
      ),
  });

export const licenseSchema = createLicenseSchema();

export type LicenseSchemaValues = z.input<typeof licenseSchema>;
export type LicenseSchemaOutput = z.output<typeof licenseSchema>;
