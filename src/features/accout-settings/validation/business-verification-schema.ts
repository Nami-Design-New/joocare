import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const BusinessVerificationSchema = z.object({
  commercial_registration_number: z.string().min(1, { message: "This field is required" }).max(20, { message: "Commercial registration number must be at most 20 characters" }),
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
  commercial_registration_issue_date: z.coerce.date({
    message: "Issue date is required",
  }),

  commercial_registration_expiry_date: z.coerce.date({
    message: "Expiry date is required",
  }),
  commercial_registration_image: z
    .any()
    .optional(),
  employer_type_id: z.string().min(1, { message: "employer type is required" }),
  medical_facility_license_number: z.string().min(1, { message: "This field is required" }).max(20, { message: "Medical facility license number must be at most 20 characters" }),
  license_issuing_authority: z
    .string()
    .min(3, { message: "license issuing authority is required" })
    .max(150, { message: "license issuing authority must be at most 150 characters" }),
  specialty_id: z
    .string({
      error: "specialty scope practice is required",
    })
    .min(1, { message: "specialty scope practice is required" }),
  medical_license_issue_date: z.coerce.date({
    message: "Medical issue date is required",
  }),

  medical_license_expiry_date: z.coerce.date({
    message: "Medical expiry date is required",
  }),
  medical_license_image: z
    .any()
    .optional(),
}).refine((data) => data.commercial_registration_issue_date >= today, {
  message: "Issue date must be today or later",
  path: ["commercial_registration_issue_date"],
})
  .refine((data) => data.commercial_registration_expiry_date >= today, {
    message: "Expiry date must be today or later",
    path: ["commercial_registration_expiry_date"],
  })
  .refine(
    (data) =>
      data.commercial_registration_expiry_date >
      data.commercial_registration_issue_date,
    {
      message: "Expiry date must be after issue date",
      path: ["commercial_registration_expiry_date"],
    }
  ).refine((data) => data.medical_license_issue_date >= today, {
    message: "Medical issue date must be today or later",
    path: ["medical_license_issue_date"],
  })
  .refine((data) => data.medical_license_expiry_date >= today, {
    message: "Medical expiry date must be today or later",
    path: ["medical_license_expiry_date"],
  })
  .refine(
    (data) =>
      data.medical_license_expiry_date >
      data.medical_license_issue_date,
    {
      message: "Medical expiry date must be after issue date",
      path: ["medical_license_expiry_date"],
    }
  )


export type TBusinessVerificationSchema = z.infer<
  typeof BusinessVerificationSchema
>;

