import { z } from "zod";

const commercialRegisterSchema = z
  .string()
  .min(1, { message: "commercial register is required" })
  .refine(
    (value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly;
      // return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    },
    {
      message: "commercial register must be digits",
    },
  );
const medicalFacilityLicenseNumberSchema = z
  .string()
  .min(1, { message: "medical facility license number is required" })
  .refine(
    (value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly;
      // return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    },
    {
      message: "medical facility license number must be digits",
    },
  );

export const BusinessVerificationSchema = z.object({
  commercialRegister: commercialRegisterSchema,
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
  commercialRegistrationIssueDate: z
    .string()
    .min(1, { message: "commercial registration issue date is required" }),
  commercialRegistrationExpiryDate: z
    .string()
    .min(1, { message: "commercial registration expiry date is required" }),
  commercialRegistrationImage: z
    .array(z.instanceof(File), {
      error: "commercial registration image is required",
    })
    .min(1, { message: "commercial registration image is required" }),
  employerType: z.string().min(1, { message: "employer type is required" }),
  medicalFacilityLicenseNumber: medicalFacilityLicenseNumberSchema,
  licenseIssuingAuthority: z
    .string()
    .min(1, { message: "license issuing authority is required" }),
  specialtyScopePractice: z
    .string({
      error: "specialty scope practice is required",
    })
    .min(1, { message: "specialty scope practice is required" }),
  medicalRegistrationIssueDate: z
    .string()
    .min(1, { message: "medical registration issue date is required" }),
  medicalRegistrationExpiryDate: z
    .string()
    .min(1, { message: "medical registration expiry date is required" }),
  medicalLicenseImage: z
    .array(z.instanceof(File), {
      error: "medical license image is required",
    })
    .min(1, { message: "medical license image is required" }),
});

export type TBusinessVerificationSchema = z.infer<
  typeof BusinessVerificationSchema
>;
