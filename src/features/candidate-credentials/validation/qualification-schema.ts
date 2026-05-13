import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

type CreateQualificationSchemaOptions = {
  requireImage?: boolean;
  messages?: {
    degreeMin: string;
    degreeMax: string;
    universityMin: string;
    universityMax: string;
    countryRequired: string;
    startDateRequired: string;
    imageRequired: string;
    oneImageOnly: string;
    imageType: string;
    imageSize: string;
    startDatePast: string;
    endDateAfterStart: string;
  };
};

export const createQualificationSchema = ({
  requireImage = true,
  messages,
}: CreateQualificationSchemaOptions = {}) =>
  z
  .object({
    degree: z
      .string()
      .trim()
      .min(3, messages?.degreeMin ?? "Degree must be at least 3 characters.")
      .max(100, messages?.degreeMax ?? "Degree must be at most 100 characters."),
    university: z
      .string()
      .trim()
      .min(3, messages?.universityMin ?? "University must be at least 3 characters.")
      .max(150, messages?.universityMax ?? "University must be at most 150 characters."),
    countryId: z.string().trim().min(1, messages?.countryRequired ?? "Country is required."),
    startDate: z.string().min(1, messages?.startDateRequired ?? "Start date is required."),
    endDate: z.string().optional(),
    image: z
      .array(z.instanceof(File))
      .min(requireImage ? 1 : 0, messages?.imageRequired ?? "Qualification image is required.")
      .max(1, messages?.oneImageOnly ?? "Only one image is allowed.")
      .refine(
        (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
        messages?.imageType ?? "Qualification image must be JPG or PNG.",
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
        messages?.imageSize ?? "Qualification image size must not exceed 5MB.",
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

export const qualificationSchema = createQualificationSchema();

export type QualificationSchemaValues = z.input<typeof qualificationSchema>;
export type QualificationSchemaOutput = z.output<typeof qualificationSchema>;
