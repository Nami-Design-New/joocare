import { MIN_PHONE_NUMBER_LENGTH } from "@/shared/lib/phone";
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
  required = true,
  maxSize,
  allowedTypes,
  requiredMessage,
  invalidTypeMessage,
  invalidSizeMessage,
}: {
  required?: boolean;
  maxSize: number;
  allowedTypes: string[];
  requiredMessage: string;
  invalidTypeMessage: string;
  invalidSizeMessage: string;
}) {
  return z
    .array(z.instanceof(File))
    .min(required ? 1 : 0, { message: requiredMessage })
    .max(1, { message: "Only one file is allowed." })
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

type CreateSettingBasicInfoSchemaOptions = {
  requireCv?: boolean;
};

export const createSettingBasicInfoSchema = ({
  requireCv = true,
}: CreateSettingBasicInfoSchemaOptions = {}) =>
  z
    .object({
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
        .trim()
        .min(MIN_PHONE_NUMBER_LENGTH, { message: "Phone number is required" }),
      jobTitle: z
        .string({
          error: "job title is required",
        })
        .min(1, { message: "Job title is required." }),
      otherJobTitle: z.string().default(""),
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
        required: false,
        maxSize: MAX_IMAGE_SIZE,
        allowedTypes: ALLOWED_IMAGE_TYPES,
        requiredMessage: "Profile image is required.",
        invalidTypeMessage: "Profile image must be JPG or PNG.",
        invalidSizeMessage: "Profile image size must not exceed 2MB.",
      }),
      uploadCV: optionalFileArrayField({
        required: requireCv,
        maxSize: MAX_CV_SIZE,
        allowedTypes: ALLOWED_CV_TYPES,
        requiredMessage: "CV is required.",
        invalidTypeMessage: "CV must be a PDF or Word document.",
        invalidSizeMessage: "CV size must not exceed 5MB.",
      }),
    })
    .refine(
      (data) => data.jobTitle !== "__other__" || Boolean(data.otherJobTitle.trim()),
      {
        message: "Please enter the other job title.",
        path: ["otherJobTitle"],
      },
    );

export const SettingBasicInfoSchema = createSettingBasicInfoSchema();

export type TSettingBasicInfoSchema = z.infer<typeof SettingBasicInfoSchema>;
