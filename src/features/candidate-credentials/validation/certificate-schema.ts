import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const certificateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Certificate name must be at least 3 characters.")
      .max(100, "Certificate name must be at most 100 characters."),
    company: z
      .string()
      .trim()
      .min(3, "Issuing organization must be at least 3 characters.")
      .max(150, "Issuing organization must be at most 150 characters."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(),
    image: z
      .array(z.instanceof(File))
      .min(1, "Certificate image is required.")
      .max(1, "Only one image is allowed.")
      .refine(
        (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
        "Certificate image must be JPG or PNG.",
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
        "Certificate image size must not exceed 5MB.",
      ),
  })
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: "Start date must be today or earlier.",
    path: ["startDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export type CertificateSchemaValues = z.input<typeof certificateSchema>;
export type CertificateSchemaOutput = z.output<typeof certificateSchema>;
