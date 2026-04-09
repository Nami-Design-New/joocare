import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_CV_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function optionalSelectField() {
  return z.string().default("");
}

function optionalFileArrayField({
  maxSize,
  allowedTypes,
  invalidTypeMessage,
  invalidSizeMessage,
}: {
  maxSize: number;
  allowedTypes: string[];
  invalidTypeMessage: string;
  invalidSizeMessage: string;
}) {
  return z
    .array(z.instanceof(File))
    .max(1)
    .optional()
    .default([])
    .refine(
      (files) => files.every((file) => allowedTypes.includes(file.type)),
      invalidTypeMessage,
    )
    .refine(
      (files) => files.every((file) => file.size <= maxSize),
      invalidSizeMessage,
    );
}

function isAtLeast18YearsOld(value: string) {
  const birthDate = new Date(value);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  const adultDate = new Date(
    birthDate.getFullYear() + 18,
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  return adultDate <= today;
}

export const SettingBasicInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters." })
    .max(255, { message: "Full name must be at most 255 characters." }),
  email: z
    .string()
    .min(1, { message: "email is required" })
    .email({ message: "Not valid email" }),
  phoneNumber: z
    .string({
      error: "phone number is required",
    })
    .min(10, { message: "Phone number is required" }),

  jobTitle: z
    .string({
      error: "job title is required",
    })
    .min(1, { message: "Job title is required." }),

  specialty: optionalSelectField(),

  yearsOfExperience: optionalSelectField(),

  country: z
    .string({
      error: "Current location country is required.",
    })
    .min(1, { message: "Country is required." }),

  city: z
    .string({
      error: "Current location city is required.",
    })
    .min(1, { message: "City is required." }),
  dateOfBirth: z
    .string()
    .default("")
    .refine((value) => value === "" || isAtLeast18YearsOld(value), {
      message: "You must be at least 18 years old.",
    }),
  profileImage: optionalFileArrayField({
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
    invalidTypeMessage: "Profile image must be JPG or PNG.",
    invalidSizeMessage: "Profile image size must not exceed 2MB.",
  }),
  uploadCV: optionalFileArrayField({
    maxSize: MAX_CV_SIZE,
    allowedTypes: ALLOWED_CV_TYPES,
    invalidTypeMessage: "CV must be a PDF or Word document.",
    invalidSizeMessage: "CV size must not exceed 5MB.",
  }),
});

export type TSettingBasicInfoSchema = z.infer<typeof SettingBasicInfoSchema>;
