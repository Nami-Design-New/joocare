import { z } from "zod";

// ─────────────────────────────────────────────
// STEP 1 — Job Post Schema
// Matches: JobPostStepOne component
// ─────────────────────────────────────────────

export const step1Schema = z
  .object({
    // ── Core Info ──────────────────────────────
    title: z.string().min(1, "Job title is required"),
    otherJobTitle: z.string().optional(),
    license: z.string().min(1, "Professional license is required"),

    // ── Salary (conditionally required) ────────
    addSalary: z.boolean().default(false),
    salary: z
      .object({
        min: z.coerce.number().min(0).optional(),
        max: z.coerce.number().min(0).optional(),
        type: z.string().optional(), // e.g. "hourly", "annual"
        currency: z.string().optional(), // e.g. "USD", "AED"
      })
      .optional()
      .superRefine((salary, ctx) => {
        // This is wired up in the refine below after merging addSalary
      }),

    // ── Classification ─────────────────────────
    category: z.string().min(1, "Category is required"),
    specialty: z.string().min(1, "Specialty is required"),

    // ── Employment Type ────────────────────────
    employmentType: z.string().min(1, "Employment type is required"),
    roleCategory: z.string().min(1, "Role category is required"),
    seniorityLevel: z.string().optional(), // marked optional in UI (hint="optional")

    // ── Location ───────────────────────────────
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),

    // ── Experience ─────────────────────────────
    yearsOfExperience: z.string().min(1, "Years of experience is required"),

    // ── Education & Certifications ─────────────
    educationLevel: z.string().min(1, "Education level is required"),
    mandatoryCertifications: z
      .string()
      .min(1, "Mandatory certifications is required"),
    availability: z.string().min(1, "Availability is required"),
  })
  // Salary fields are required only when the toggle is ON
  .superRefine((data, ctx) => {
    if (data.title === "__other__" && !data.otherJobTitle?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Other job title is required",
        path: ["otherJobTitle"],
      });
    }

    if (data.addSalary) {
      if (!data.salary?.min && data.salary?.min !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum salary is required",
          path: ["salary", "min"],
        });
      }
      if (!data.salary?.max && data.salary?.max !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum salary is required",
          path: ["salary", "max"],
        });
      }
      if (
        data.salary?.min !== undefined &&
        data.salary?.max !== undefined &&
        data.salary.max <= data.salary.min
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max salary must be greater than min",
          path: ["salary", "max"],
        });
      }
      if (!data.salary?.type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Salary type is required",
          path: ["salary", "type"],
        });
      }
      if (!data.salary?.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required",
          path: ["salary", "currency"],
        });
      }
    }
  });

// ─────────────────────────────────────────────
// STEP 2 SCHEMA
// Fields: description (CKEditor HTML), skills (multi-select → string[])
// ─────────────────────────────────────────────

export const step2Schema = z.object({
  // CKEditor emits an HTML string; strip tags to measure real content length
  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length >= 20,
      "Description must be at least 20 characters",
    ),

  // SelectInputField stores a single string value per selection.
  // If you later switch to a multi-select, change to z.array(z.string())
  skills: z.array(z.string()).min(1, "At least one skill is required"),
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
  specialty: "",
  employmentType: "",
  roleCategory: "",
  seniorityLevel: "",
  country: "",
  city: "",
  yearsOfExperience: "",
  educationLevel: "",
  mandatoryCertifications: "",
  availability: "",
  // step 2
  description: "",
  skills: [],
};
