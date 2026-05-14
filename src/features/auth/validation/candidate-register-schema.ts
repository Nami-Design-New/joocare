import { z } from "zod";

// Reusable transforms
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val?.trim() === "" ? undefined : val));

type CreateRegisterCandidateSchemaOptions = {
  phoneRequired?: string;
  phoneInvalid?: string;
  phoneDigits?: string;
  fullNameRequired?: string;
  fullNameMin?: string;
  emailRequired?: string;
  emailInvalid?: string;
  jobTitleRequired?: string;
  countryRequired?: string;
  cityRequired?: string;
  passwordRequired?: string;
  passwordMin?: string;
  passwordMax?: string;
  cvRequired?: string;
  otherJobTitleRequired?: string;
  licenseCountryRequired?: string;
  licenseTitleRequired?: string;
  licenseTitleMin?: string;
  licenseTitleMax?: string;
};

export const createRegisterCandidateSchema = ({
  phoneRequired = "Phone number is required",
  phoneInvalid = "Phone number contains invalid characters",
  phoneDigits = "Phone number must be between 7-15 digits",
  fullNameRequired = "Full name is required",
  fullNameMin = "Full name must be at least 2 characters",
  emailRequired = "Email is required",
  emailInvalid = "Please enter a valid email address",
  jobTitleRequired = "Job title is required",
  countryRequired = "Country is required",
  cityRequired = "City is required",
  passwordRequired = "Password is required",
  passwordMin = "Password must be at least 6 characters",
  passwordMax = "Password must be at most 15 characters",
  cvRequired = "cv is required",
  otherJobTitleRequired = "Other job title is required",
  licenseCountryRequired = "License country is required when you have a medical license",
  licenseTitleRequired = "License title is required",
  licenseTitleMin = "License title must be at least 2 characters",
  licenseTitleMax = "License title must be at most 100 characters",
}: CreateRegisterCandidateSchemaOptions = {}) => {
  const phoneNumberSchema = z
    .string({
      message: phoneRequired,
    })
    .min(1, { message: phoneRequired })
    .regex(/^[\d\s\-\+\(\)]+$/, {
      message: phoneInvalid,
    })
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
      },
      { message: phoneDigits },
    );

  return z
    .object({
      fullName: z
        .string()
        .min(1, { message: fullNameRequired })
        .min(2, { message: fullNameMin }),

      email: z
        .string()
        .min(1, { message: emailRequired })
        .email({ message: emailInvalid }),

      phoneNumber: phoneNumberSchema,

      jobTitle: z.string({
        message: jobTitleRequired,
      }).min(1, { message: jobTitleRequired }),
      otherJobTitle: z.string().default(""),

      country: z.string({
        message: countryRequired,
      }).min(1, { message: countryRequired }),

      city: z.string({
        message: cityRequired,
      }).min(1, { message: cityRequired }),

      createPassword: z
        .string({
          message: passwordRequired,
        })
        .min(6, { message: passwordMin }).max(15, { message: passwordMax }),

      uploadCV: z
        .string(cvRequired)
        .min(1, { message: cvRequired })
        .transform((val) => (val?.trim() === "" ? undefined : val)),

      confirmRegister: z.boolean().default(false),

      licenseTitle: z
        .string()
        .optional()
        .transform((val) => (val?.trim() === "" ? undefined : val)),

      licenseNumber: optionalString,

      specificCountry: optionalString,

      uploadLicense: optionalString,
    })
    .superRefine((data, ctx) => {
      if (data.jobTitle === "__other__" && !data.otherJobTitle.trim()) {
        ctx.addIssue({
          path: ["otherJobTitle"],
          message: otherJobTitleRequired,
          code: "custom",
        });
      }

      if (data.confirmRegister) {
        if (!data.specificCountry) {
          ctx.addIssue({
            path: ["specificCountry"],
            message: licenseCountryRequired,
            code: "custom",
          });
        }

        if (!data.licenseTitle) {
          ctx.addIssue({
            path: ["licenseTitle"],
            message: licenseTitleRequired,
            code: "custom",
          });
        } else if (data.licenseTitle.length < 2) {
          ctx.addIssue({
            path: ["licenseTitle"],
            message: licenseTitleMin,
            code: "custom",
          });
        } else if (data.licenseTitle.length > 100) {
          ctx.addIssue({
            path: ["licenseTitle"],
            message: licenseTitleMax,
            code: "custom",
          });
        }
      }
    });
};

export const RegisterCandidateSchema = createRegisterCandidateSchema();

export type TRegisterCandidateSchema = z.infer<typeof RegisterCandidateSchema>;
