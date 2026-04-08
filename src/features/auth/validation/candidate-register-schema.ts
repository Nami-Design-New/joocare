import { z } from "zod";

const phoneNumberSchema = z
  .string({
    message: 'Phone number is required',
  })
  .min(1, { message: "Phone number is required" })
  .regex(/^[\d\s\-\+\(\)]+$/, {
    message: "Phone number contains invalid characters",
  })
  .refine(
    (value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    },
    { message: "Phone number must be between 7-15 digits" },
  );

// Reusable transforms
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val?.trim() === "" ? undefined : val));

const optionalFileArray = z
  .array(z.string())
  .optional()
  .transform((val) => (val && val.length === 0 ? undefined : val));

export const RegisterCandidateSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),

    phoneNumber: phoneNumberSchema,

    jobTitle: z.string({
      message: 'Job title is required',
    }).min(1, { message: "Job title is required" }),

    country: z.string({
      message: 'Country is required',
    }).min(1, { message: "Country is required" }),

    city: z.string({
      message: 'City is required',
    }).min(1, { message: "City is required" }),

    createPassword: z
      .string({
        message: 'Password is required',
      })
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),

    // Sends undefined (omitted) if no files uploaded
    uploadCV: z.string().optional(),

    confirmRegister: z.boolean().default(false),

    // Sends undefined (omitted) if left empty
    licenseTitle: z
      .string()
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)),

    licenseNumber: optionalString,

    specificCountry: optionalString,

    // Sends undefined (omitted) if no files uploaded
    uploadLicense: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmRegister) {
      // specificCountry
      if (!data.specificCountry) {
        ctx.addIssue({
          path: ["specificCountry"],
          message: "License country is required when you have a medical license",
          code: "custom",
        });
      }

      // licenseTitle
      if (!data.licenseTitle) {
        ctx.addIssue({
          path: ["licenseTitle"],
          message: "License title is required",
          code: "custom",
        });
      } else if (data.licenseTitle.length < 2) {
        ctx.addIssue({
          path: ["licenseTitle"],
          message: "License title must be at least 2 characters",
          code: "custom",
        });
      } else if (data.licenseTitle.length > 100) {
        ctx.addIssue({
          path: ["licenseTitle"],
          message: "License title must be at most 100 characters",
          code: "custom",
        });
      }
    }
  });

export type TRegisterCandidateSchema = z.infer<typeof RegisterCandidateSchema>;