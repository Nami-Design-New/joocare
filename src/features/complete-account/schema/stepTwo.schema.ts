import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const stepTwoSchema = z.object({
  commercialRegister: z.string().min(1, { message: "This field is required" }).max(20, { message: "Commercial registration number must be at most 20 characters" }),
  issuingCountryLicense: z
    .string({
      error: "issuing country license is required",
    })
    .min(1, { message: "issuing country license is required" }),
  organizationSize: z
    .string({
      error: "organization size is required",
    })
    .min(1, { message: "organization size is required" }),
  commercialRegistrationIssueDate: z.coerce.date({
    message: "Issue date is required",
  }),
  commercialRegistrationExpiryDate: z.coerce.date({
    message: "Expiry date is required",
  }),
  commercialRegistrationImage: z.any().optional(),
  commercialRegistrationImagePath: z.string().optional(),
  employerType: z.string().min(1, { message: "employer type is required" }),
  medicalFacilityLicenseNumber: z.string().min(1, { message: "This field is required" }).max(20, { message: "Medical facility license number must be at most 20 characters" }),
  licenseIssuingAuthority: z
    .string()
    .min(3, { message: "license issuing authority is required" })
    .max(150, { message: "license issuing authority must be at most 150 characters" }),
  specialtyScopePractice: z
    .string({
      error: "specialty scope practice is required",
    })
    .min(1, { message: "specialty scope practice is required" }),
  medicalRegistrationIssueDate: z.coerce.date({
    message: "Medical issue date is required",
  }),
  medicalRegistrationExpiryDate: z.coerce.date({
    message: "Medical expiry date is required",
  }),
  medicalLicenseImage: z.any().optional(),
  medicalLicenseImagePath: z.string().optional()
}).refine((data) => data.commercialRegistrationIssueDate >= today, {
  message: "Issue date must be today or later",
  path: ["commercialRegistrationIssueDate"],
})
  .refine((data) => data.commercialRegistrationExpiryDate >= today, {
    message: "Expiry date must be today or later",
    path: ["commercialRegistrationExpiryDate"],
  })
  .refine(
    (data) =>
      data.commercialRegistrationExpiryDate >
      data.commercialRegistrationIssueDate,
    {
      message: "Expiry date must be after issue date",
      path: ["commercialRegistrationExpiryDate"],
    }
  ).refine((data) => data.medicalRegistrationIssueDate >= today, {
    message: "Medical issue date must be today or later",
    path: ["medicalRegistrationIssueDate"],
  })
  .refine((data) => data.medicalRegistrationExpiryDate >= today, {
    message: "Medical expiry date must be today or later",
    path: ["medicalRegistrationExpiryDate"],
  })
  .refine(
    (data) =>
      data.medicalRegistrationExpiryDate >
      data.medicalRegistrationIssueDate,
    {
      message: "Medical expiry date must be after issue date",
      path: ["medicalRegistrationExpiryDate"],
    }
  )

