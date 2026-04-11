import { z } from "zod";

export const BusinessVerificationSchema = z.object({
  commercial_registration_number: z.string().min(1, { message: "This field is required" }),
  license_issue_country_id: z
    .string({
      error: "issuing country license is required",
    })
    .min(1, { message: "issuing country license is required" }),
  organization_size_id: z
    .string({
      error: "organization size is required",
    })
    .min(1, { message: "organization size is required" }),
  commercial_registration_issue_date: z
    .string()
    .min(1, { message: "commercial registration issue date is required" }),
  commercial_registration_expiry_date: z
    .string()
    .min(1, { message: "commercial registration expiry date is required" }),
  commercial_registration_image: z
    .any()
    .optional(),
  employer_type_id: z.string().min(1, { message: "employer type is required" }),
  medical_facility_license_number: z.string().min(1, { message: "This field is required" }),
  license_issuing_authority: z
    .string()
    .min(1, { message: "license issuing authority is required" }),
  specialty_id: z
    .string({
      error: "specialty scope practice is required",
    })
    .min(1, { message: "specialty scope practice is required" }),
  medical_license_issue_date: z
    .string()
    .min(1, { message: "medical registration issue date is required" }),
  medical_license_expiry_date: z
    .string()
    .min(1, { message: "medical registration expiry date is required" }),
  medical_license_image: z
    .any()
    .optional(),
});

export type TBusinessVerificationSchema = z.infer<
  typeof BusinessVerificationSchema
>;

