import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const dateField = (requiredMessage: string) =>
  z.string().min(1, { message: requiredMessage });

const parseDateValue = (value: string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

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
  commercial_registration_issue_date: dateField("Issue date is required"),
  commercial_registration_expiry_date: dateField("Expiry date is required"),
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
  medical_license_issue_date: dateField("Medical issue date is required"),
  medical_license_expiry_date: dateField("Medical expiry date is required"),
  medical_license_image: z
    .any()
    .optional(),
}).refine((data) => parseDateValue(data.commercial_registration_issue_date) <= today, {
  message: "Commercial registration issue date must be today or a past date",
  path: ["commercial_registration_issue_date"],
})
  .refine((data) => parseDateValue(data.commercial_registration_expiry_date) >= today, {
    message: "Commercial registration expiry date must be today or a future date",
    path: ["commercial_registration_expiry_date"],
  })
  .refine(
    (data) =>
      parseDateValue(data.commercial_registration_expiry_date) >
      parseDateValue(data.commercial_registration_issue_date),
    {
      message: "Commercial registration expiry date must be after issue date",
      path: ["commercial_registration_expiry_date"],
    }
  ).refine((data) => parseDateValue(data.medical_license_issue_date) <= today, {
    message: "Medical issue date must be today or a past date",
    path: ["medical_license_issue_date"],
  })
  .refine((data) => parseDateValue(data.medical_license_expiry_date) >= today, {
    message: "Medical license expiry date must be today or a future date",
    path: ["medical_license_expiry_date"],
  })
  .refine(
    (data) =>
      parseDateValue(data.medical_license_expiry_date) >
      parseDateValue(data.medical_license_issue_date),
    {
      message: "Medical expiry date must be after issue date",
      path: ["medical_license_expiry_date"],
    }
  )


export type TBusinessVerificationSchema = z.infer<
  typeof BusinessVerificationSchema
>;

