import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0)
const dateField = (requiredMessage: string) =>
  z.string().min(1, { message: requiredMessage });

const parseDateValue = (value: string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

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
  commercialRegistrationIssueDate: dateField("Issue date is required"),
  commercialRegistrationExpiryDate: dateField("Expiry date is required"),
  commercialRegistrationImage: z.any().optional(),
  commercialRegistrationImagePath: z.string().min(1, { message: "Commercial Registration Image is required" }),
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
  medicalRegistrationIssueDate: dateField("Medical issue date is required"),
  medicalRegistrationExpiryDate: dateField("Medical expiry date is required"),
  medicalLicenseImage: z.any().optional(),
  medicalLicenseImagePath: z.string().optional()
}).refine((data) => parseDateValue(data.commercialRegistrationIssueDate) <= today, {
  path: ["commercialRegistrationIssueDate"],
})
  .refine((data) => parseDateValue(data.commercialRegistrationExpiryDate) >= today, {
    message: "Commercial registration expiry date must be today or a future date",
    path: ["commercialRegistrationExpiryDate"],
  })
  .refine(
    (data) =>
      parseDateValue(data.commercialRegistrationExpiryDate) >
      parseDateValue(data.commercialRegistrationIssueDate),
    {
      message: "Commercial registration expiry date must be after issue date",
      path: ["commercialRegistrationExpiryDate"],
    }
  ).refine((data) => parseDateValue(data.medicalRegistrationIssueDate) <= today, {
  path: ["medicalRegistrationIssueDate"],
  })
  .refine((data) => parseDateValue(data.medicalRegistrationExpiryDate) >= today, {
    message: "Medical license expiry date must be today or a future date",
    path: ["medicalRegistrationExpiryDate"],
  })
  .refine(
    (data) =>
      parseDateValue(data.medicalRegistrationExpiryDate) >
      parseDateValue(data.medicalRegistrationIssueDate),

    {
      message: "Medical expiry date must be after issue date",
      path: ["medicalRegistrationExpiryDate"],
    }
  )

