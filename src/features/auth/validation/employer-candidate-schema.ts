import { z } from "zod";

// Validation helper for password strength
const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(6, { message: "Password must be at least 6 characters" })
  .max(20, { message: "Password must be at most 20 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

// Validation helper for phone number (digits only, spaces allowed but will be validated)
const phoneNumberSchema = z
  .string()
  .min(1, { message: "Phone number is required" })
  .regex(/^[\d\s\-\+\(\)]+$/, {
    message: "Phone number contains invalid characters",
  })
  .refine((value) => {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }, {
    message: "Phone number must be between 7-15 digits",
  });

export const RegisterCandidateSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(100, { message: "Full name must be at most 100 characters" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),

    phoneCode: z
      .string()
      .min(1, { message: "Phone code is required" })
      .regex(/^\+\d{1,3}$/, { message: "Invalid phone code format" }),

    phoneNumber: phoneNumberSchema,

    jobTitle: z
      .string()
      .min(1, { message: "Job title is required" }),

    country: z
      .string()
      .min(1, { message: "Country is required" }),

    city: z
      .string()
      .min(1, { message: "City is required" }),

    createPassword: passwordSchema,

    // CV is optional
    uploadCV: z
      .array(z.instanceof(File))
      .optional()
      .default([])
      .refine((files) => files.length <= 2, {
        message: "You can upload a maximum of 2 CV files",
      }),

    confirmRegister: z.boolean().default(false),

    // License fields - only required if confirmRegister is true
    licenseTitle: z
      .string()
      .optional()
      .refine((value) => !value || value.trim().length > 0, {
        message: "License title cannot be empty if provided",
      }),

    licenseNumber: z
      .string()
      .optional()
      .refine((value) => !value || /^\d+$/.test(value), {
        message: "License number must contain only digits",
      }),

    specificCountry: z
      .string()
      .optional(),

    uploadLicense: z
      .array(z.instanceof(File))
      .optional()
      .default([])
      .refine((files) => files.length <= 2, {
        message: "You can upload a maximum of 2 license files",
      }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation when medical license is confirmed
    if (data.confirmRegister) {
      // Validate license title
      if (!data.licenseTitle || data.licenseTitle.trim() === "") {
        ctx.addIssue({
          path: ["licenseTitle"],
          message: "License title is required when you have a medical license",
          code: "custom",
        });
      }

      // Validate license number
      if (!data.licenseNumber || data.licenseNumber.trim() === "") {
        ctx.addIssue({
          path: ["licenseNumber"],
          message: "License number is required when you have a medical license",
          code: "custom",
        });
      }

      // Validate specific country
      if (!data.specificCountry || data.specificCountry.trim() === "") {
        ctx.addIssue({
          path: ["specificCountry"],
          message:
            "License country is required when you have a medical license",
          code: "custom",
        });
      }

      // Validate license upload
      if (!data.uploadLicense || data.uploadLicense.length === 0) {
        ctx.addIssue({
          path: ["uploadLicense"],
          message: "License image upload is required when you have a medical license",
          code: "custom",
        });
      }
    }
  });

export type TRegisterCandidateSchema = z.infer<typeof RegisterCandidateSchema>;