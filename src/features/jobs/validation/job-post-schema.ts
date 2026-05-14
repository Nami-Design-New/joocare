import { z } from "zod";

const optionalSalaryNumber = z.preprocess((value) => {
  if (value === "" || value == null) {
    return undefined;
  }

  return value;
}, z.coerce.number().min(0).max(9999999999, "companyPage.postJob.validation.salaryMaxDigits").optional());

// ─────────────────────────────────────────────
// STEP 1 — Job Post Schema
// Matches: JobPostStepOne component
// ─────────────────────────────────────────────

export const step1Schema = z
  .object({
    // ── Core Info ──────────────────────────────
    title: z.string().min(1, "companyPage.postJob.validation.jobTitleRequired"),
    otherJobTitle: z.string().optional(),
    license: z.string().min(1, "companyPage.postJob.validation.professionalLicenseRequired"),

    // ── Salary (conditionally required) ────────
    // addSalary: z.boolean().default(false),
    // salary: z
    //   .object({
    //     min: z.coerce.number().min(0).optional(),
    //     max: z.coerce.number().min(0).optional(),
    //     type: z.string().optional(), // e.g. "hourly", "annual"
    //     currency: z.string().optional(), // e.g. "USD", "AED"
    //   })
    //   .optional()
    //   .superRefine((salary, ctx) => {
    //     // This is wired up in the refine below after merging addSalary
    //   }),

    addSalary: z.boolean().default(false),

    salary: z
      .object({
        min: optionalSalaryNumber,
        max: optionalSalaryNumber,
        type: z.string().optional(),
        currency: z.string().optional(),
      })
      .optional(),
    // ── Classification ─────────────────────────
    category: z.string().min(1, "companyPage.postJob.validation.categoryRequired"),
    otherCategoryTitle: z.string().optional(),
    specialty: z.string().min(1, "companyPage.postJob.validation.specialtyRequired"),

    // ── Employment Type ────────────────────────
    employmentType: z.string().min(1, "companyPage.postJob.validation.employmentTypeRequired"),
    roleCategory: z.string().min(1, "companyPage.postJob.validation.roleCategoryRequired"),
    seniorityLevel: z.string().optional(), // marked optional in UI (hint="optional")

    // ── Location ───────────────────────────────
    country: z.string().min(1, "companyPage.postJob.validation.countryRequired"),
    city: z.string().min(1, "companyPage.postJob.validation.cityRequired"),

    // ── Experience ─────────────────────────────
    yearsOfExperience: z.string().min(1, "companyPage.postJob.validation.yearsOfExperienceRequired"),
    otherExperienceTitle: z.string().optional(),

    // ── Education & Certifications ─────────────
    educationLevel: z
      .array(z.string())
      .min(1, "companyPage.postJob.validation.educationLevelRequired"),
    mandatoryCertifications: z
      .array(z.string())
      .min(1, "companyPage.postJob.validation.mandatoryCertificationsRequired"),
    availability: z.string().min(1, "companyPage.postJob.validation.availabilityRequired"),
    otherAvailabilityTitle: z.string().optional(),
  }).superRefine((data, ctx) => {
    // ── Other job title ──
    if (data.title === "__other__" && !data.otherJobTitle?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "companyPage.postJob.validation.otherJobTitleRequired",
        path: ["otherJobTitle"],
      });
    }

    if (data.category === "__other__" && !data.otherCategoryTitle?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "companyPage.postJob.validation.otherCategoryRequired",
        path: ["otherCategoryTitle"],
      });
    }

    if (
      data.yearsOfExperience === "__other__" &&
      !data.otherExperienceTitle?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "companyPage.postJob.validation.otherYearsOfExperienceRequired",
        path: ["otherExperienceTitle"],
      });
    }

    if (data.availability === "__other__" && !data.otherAvailabilityTitle?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "companyPage.postJob.validation.otherAvailabilityRequired",
        path: ["otherAvailabilityTitle"],
      });
    }

    // ── Salary validation ──
    if (data.addSalary) {
      if (!data.salary) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.salaryRequired",
          path: ["salary"],
        });
        return;
      }

      if (data.salary.min == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.minSalaryRequired",
          path: ["salary", "min"],
        });
      }

      if (data.salary.max == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.maxSalaryRequired",
          path: ["salary", "max"],
        });
      }

      if (
        data.salary.min != null &&
        data.salary.max != null &&
        data.salary.max <= data.salary.min
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.maxSalaryGreaterThanMin",
          path: ["salary", "max"],
        });
      }

      if (!data.salary.type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.salaryTypeRequired",
          path: ["salary", "type"],
        });
      }

      if (!data.salary.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyPage.postJob.validation.currencyRequired",
          path: ["salary", "currency"],
        });
      }
    }
  })
// ─────────────────────────────────────────────
// STEP 2 SCHEMA
// Fields: description (CKEditor HTML), skills (multi-select → string[])
// ─────────────────────────────────────────────

export const step2Schema = z.object({
  // CKEditor emits an HTML string; strip tags to measure real content length
  description: z
    .string()
    .min(1, "companyPage.postJob.validation.descriptionRequired"),
  // .refine(
  //   (val) => val.replace(/<[^>]*>/g, "").trim().length >= 20,
  //   "Description must be at least 20 characters",
  // ),

  // SelectInputField stores a single string value per selection.
  // If you later switch to a multi-select, change to z.array(z.string())
  skills: z.array(z.string()).min(1, "companyPage.postJob.validation.atLeastOneSkillRequired"),
});

// ─────────────────────────────────────────────
// COMBINED SCHEMA  (used by useForm resolver)
// ─────────────────────────────────────────────

export const jobFormSchema = step1Schema.merge(step2Schema);
export type JobFormData = z.infer<typeof jobFormSchema>;

// ─────────────────────────────────────────────
// PER-STEP SHAPES  (used by trigger() in PostJobForm)
// Only plain z.object schemas can expose .shape — unwrap step1
// ─────────────────────────────────────────────
export const stepSchemas = [step1Schema, step2Schema] as const;
export type StepIndex = 0 | 1;

export const STEPS = [
  { label: "Job Details", number: 1 },
  { label: "Job Description & Requirements", number: 2 },
  { label: "Job Preview", number: 3 },
];

export const jobFormDefaults: Partial<JobFormData> = {
  title: "",
  otherJobTitle: "",
  license: "",
  addSalary: false,
  salary: { min: undefined, max: undefined, type: "", currency: "" },
  category: "",
  otherCategoryTitle: "",
  specialty: "",
  employmentType: "",
  roleCategory: "",
  seniorityLevel: "",
  country: "",
  city: "",
  yearsOfExperience: "",
  otherExperienceTitle: "",
  educationLevel: [],
  mandatoryCertifications: [],
  availability: "",
  otherAvailabilityTitle: "",
  // step 2
  description: "",
  skills: [],
};
