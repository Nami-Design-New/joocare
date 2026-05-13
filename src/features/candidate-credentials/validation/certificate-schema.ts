import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

type CreateCertificateSchemaOptions = {
  requireImage?: boolean;
  messages?: {
    nameMin: string;
    nameMax: string;
    companyMin: string;
    companyMax: string;
    startDateRequired: string;
    imageRequired: string;
    oneImageOnly: string;
    imageType: string;
    imageSize: string;
    startDatePast: string;
    endDateAfterStart: string;
  };
};

export const createCertificateSchema = ({
  requireImage = true,
  messages,
}: CreateCertificateSchemaOptions = {}) =>
  z
  .object({
    name: z
      .string()
      .trim()
      .min(3, messages?.nameMin ?? "Certificate name must be at least 3 characters.")
      .max(100, messages?.nameMax ?? "Certificate name must be at most 100 characters."),
    company: z
      .string()
      .trim()
      .min(3, messages?.companyMin ?? "Issuing organization must be at least 3 characters.")
      .max(150, messages?.companyMax ?? "Issuing organization must be at most 150 characters."),
    startDate: z.string().min(1, messages?.startDateRequired ?? "Start date is required."),
    endDate: z.string().optional(),
    image: z
      .array(z.instanceof(File))
      .min(requireImage ? 1 : 0, messages?.imageRequired ?? "Certificate image is required.")
      .max(1, messages?.oneImageOnly ?? "Only one image is allowed.")
      .refine(
        (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
        messages?.imageType ?? "Certificate image must be JPG or PNG.",
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
        messages?.imageSize ?? "Certificate image size must not exceed 5MB.",
      ),
  })
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: messages?.startDatePast ?? "Start date must be today or earlier.",
    path: ["startDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: messages?.endDateAfterStart ?? "End date must be after start date.",
    path: ["endDate"],
  });

export const certificateSchema = createCertificateSchema();

export type CertificateSchemaValues = z.input<typeof certificateSchema>;
export type CertificateSchemaOutput = z.output<typeof certificateSchema>;
