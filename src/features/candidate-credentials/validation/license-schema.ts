import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const licenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "License title must be at least 3 characters.")
    .max(100, "License title must be at most 100 characters."),
  number: z
    .string()
    .trim()
    .min(3, "License number must be at least 3 characters.")
    .max(100, "License number must be at most 100 characters."),
  countryId: z.string().trim().min(1, "Country is required."),
  image: z
    .array(z.instanceof(File))
    .max(1)
    .default([])
    .refine(
      (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
      "License image must be JPG or PNG.",
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
      "License image size must not exceed 2MB.",
    ),
});

export type LicenseSchemaValues = z.input<typeof licenseSchema>;
export type LicenseSchemaOutput = z.output<typeof licenseSchema>;
