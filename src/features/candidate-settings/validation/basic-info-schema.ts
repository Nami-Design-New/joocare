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
  singleFileMessage,
}: {
  required?: boolean;
  maxSize: number;
  allowedTypes: string[];
  requiredMessage: string;
  invalidTypeMessage: string;
  invalidSizeMessage: string;
  singleFileMessage?: string;
}) {
  return z
    .array(z.instanceof(File))
    .min(required ? 1 : 0, { message: requiredMessage })
    .max(1, { message: singleFileMessage ?? "Only one file is allowed." })
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
  messages?: {
    fullNameMin: string;
    fullNameMax: string;
    emailRequired: string;
    emailInvalid: string;
    phoneRequired: string;
    jobTitleRequired: string;
    countryRequired: string;
    cityRequired: string;
    ageMin: string;
    profileImageRequired: string;
    onlyOneFileAllowed: string;
    profileImageInvalidType: string;
    profileImageInvalidSize: string;
    cvRequired: string;
    cvInvalidType: string;
    cvInvalidSize: string;
    otherJobTitleRequired: string;
  };
};

export const createSettingBasicInfoSchema = ({
  requireCv = true,
  messages,
}: CreateSettingBasicInfoSchemaOptions = {}) =>
  z
    .object({
      fullName: z
        .string()
        .trim()
        .min(3, { message: messages?.fullNameMin ?? "Full name must be at least 3 characters." })
        .max(255, { message: messages?.fullNameMax ?? "Full name must be at most 255 characters." }),
      email: z
        .string()
        .min(1, { message: messages?.emailRequired ?? "email is required" })
        .email({ message: messages?.emailInvalid ?? "Not valid email" }),
      phoneNumber: z
        .string({
          error: messages?.phoneRequired ?? "phone number is required",
        })
        .trim()
        .min(MIN_PHONE_NUMBER_LENGTH, { message: messages?.phoneRequired ?? "Phone number is required" }),
      jobTitle: z
        .string({
          error: messages?.jobTitleRequired ?? "job title is required",
        })
        .min(1, { message: messages?.jobTitleRequired ?? "Job title is required." }),
      otherJobTitle: z.string().default(""),
      specialty: optionalSelectField(),
      yearsOfExperience: optionalSelectField(),
      country: z
        .string({
          error: messages?.countryRequired ?? "Current location country is required.",
        })
        .min(1, { message: messages?.countryRequired ?? "Country is required." }),
      city: z
        .string({
          error: messages?.cityRequired ?? "Current location city is required.",
        })
        .min(1, { message: messages?.cityRequired ?? "City is required." }),
      dateOfBirth: z
        .string()
        .default("")
        .refine((value) => value === "" || isAtLeast18YearsOld(value), {
          message: messages?.ageMin ?? "You must be at least 18 years old.",
        }),
      profileImage: optionalFileArrayField({
        required: false,
        maxSize: MAX_IMAGE_SIZE,
        allowedTypes: ALLOWED_IMAGE_TYPES,
        requiredMessage: messages?.profileImageRequired ?? "Profile image is required.",
        invalidTypeMessage: messages?.profileImageInvalidType ?? "Profile image must be JPG or PNG.",
        invalidSizeMessage: messages?.profileImageInvalidSize ?? "Profile image size must not exceed 2MB.",
        singleFileMessage: messages?.onlyOneFileAllowed ?? "Only one file is allowed.",
      }),
      uploadCV: optionalFileArrayField({
        required: requireCv,
        maxSize: MAX_CV_SIZE,
        allowedTypes: ALLOWED_CV_TYPES,
        requiredMessage: messages?.cvRequired ?? "CV is required ",
        invalidTypeMessage: messages?.cvInvalidType ?? "CV must be a PDF or Word document.",
        invalidSizeMessage: messages?.cvInvalidSize ?? "Max file size is 5MB",
        singleFileMessage: messages?.onlyOneFileAllowed ?? "Only one file is allowed.",
      }),
    })
    .refine(
      (data) => data.jobTitle !== "__other__" || Boolean(data.otherJobTitle.trim()),
      {
        message: messages?.otherJobTitleRequired ?? "Please enter the other job title.",
        path: ["otherJobTitle"],
      },
    );

export const SettingBasicInfoSchema = createSettingBasicInfoSchema();

export type TSettingBasicInfoSchema = z.infer<typeof SettingBasicInfoSchema>;
