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

type CreateBusinessVerificationSchemaOptions = {
  messages?: {
    required: string;
    commercialRegistrationNumberMax: string;
    issuingCountryRequired: string;
    organizationSizeRequired: string;
    commercialIssueDateRequired: string;
    commercialExpiryDateRequired: string;
    employerTypeRequired: string;
    medicalFacilityLicenseNumberMax: string;
    licenseIssuingAuthorityMin: string;
    licenseIssuingAuthorityMax: string;
    specialtyRequired: string;
    medicalIssueDateRequired: string;
    medicalExpiryDateRequired: string;
    commercialIssueDatePast: string;
    commercialExpiryDateFuture: string;
    commercialExpiryAfterIssue: string;
    medicalIssueDatePast: string;
    medicalExpiryDateFuture: string;
    medicalExpiryAfterIssue: string;
  };
};

export const createBusinessVerificationSchema = ({
  messages,
}: CreateBusinessVerificationSchemaOptions = {}) =>
  z
    .object({
      commercial_registration_number: z
        .string()
        .min(1, { message: messages?.required ?? "This field is required" })
        .max(20, {
          message:
            messages?.commercialRegistrationNumberMax ??
            "Commercial registration number must be at most 20 characters",
        }),
      license_issue_country_id: z
        .string({
          error: messages?.issuingCountryRequired ?? "Issuing country is required",
        })
        .min(1, {
          message: messages?.issuingCountryRequired ?? "Issuing country is required",
        }),
      organization_size_id: z
        .string({
          error: messages?.organizationSizeRequired ?? "Organization size is required",
        })
        .min(1, {
          message: messages?.organizationSizeRequired ?? "Organization size is required",
        }),
      commercial_registration_issue_date: dateField(
        messages?.commercialIssueDateRequired ?? "Issue date is required",
      ),
      commercial_registration_expiry_date: dateField(
        messages?.commercialExpiryDateRequired ?? "Expiry date is required",
      ),
      commercial_registration_image: z.any().optional(),
      employer_type_id: z
        .string()
        .min(1, { message: messages?.employerTypeRequired ?? "Employer type is required" }),
      medical_facility_license_number: z
        .string()
        .min(1, { message: messages?.required ?? "This field is required" })
        .max(20, {
          message:
            messages?.medicalFacilityLicenseNumberMax ??
            "Medical facility license number must be at most 20 characters",
        }),
      license_issuing_authority: z
        .string()
        .min(3, {
          message:
            messages?.licenseIssuingAuthorityMin ??
            "License issuing authority must be at least 3 characters",
        })
        .max(150, {
          message:
            messages?.licenseIssuingAuthorityMax ??
            "License issuing authority must be at most 150 characters",
        }),
      specialty_title: z
        .string({
          error: messages?.specialtyRequired ?? "Specialty / scope of practice is required",
        })
        .min(1, {
          message: messages?.specialtyRequired ?? "Specialty / scope of practice is required",
        }),
      medical_license_issue_date: dateField(
        messages?.medicalIssueDateRequired ?? "Medical issue date is required",
      ),
      medical_license_expiry_date: dateField(
        messages?.medicalExpiryDateRequired ?? "Medical expiry date is required",
      ),
      medical_license_image: z.any().optional(),
    })
    .refine((data) => parseDateValue(data.commercial_registration_issue_date) <= today, {
      message:
        messages?.commercialIssueDatePast ??
        "Commercial registration issue date must be today or a past date",
      path: ["commercial_registration_issue_date"],
    })
    .refine((data) => parseDateValue(data.commercial_registration_expiry_date) >= today, {
      message:
        messages?.commercialExpiryDateFuture ??
        "Commercial registration expiry date must be today or a future date",
      path: ["commercial_registration_expiry_date"],
    })
    .refine(
      (data) =>
        parseDateValue(data.commercial_registration_expiry_date) >
        parseDateValue(data.commercial_registration_issue_date),
      {
        message:
          messages?.commercialExpiryAfterIssue ??
          "Commercial registration expiry date must be after issue date",
        path: ["commercial_registration_expiry_date"],
      },
    )
    .refine((data) => parseDateValue(data.medical_license_issue_date) <= today, {
      message:
        messages?.medicalIssueDatePast ?? "Medical issue date must be today or a past date",
      path: ["medical_license_issue_date"],
    })
    .refine((data) => parseDateValue(data.medical_license_expiry_date) >= today, {
      message:
        messages?.medicalExpiryDateFuture ??
        "Medical license expiry date must be today or a future date",
      path: ["medical_license_expiry_date"],
    })
    .refine(
      (data) =>
        parseDateValue(data.medical_license_expiry_date) >
        parseDateValue(data.medical_license_issue_date),
      {
        message:
          messages?.medicalExpiryAfterIssue ?? "Medical expiry date must be after issue date",
        path: ["medical_license_expiry_date"],
      },
    );

export const BusinessVerificationSchema = createBusinessVerificationSchema();


export type TBusinessVerificationSchema = z.infer<
  typeof BusinessVerificationSchema
>;

