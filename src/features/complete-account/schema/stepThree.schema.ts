import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Only JPEG, PNG, or WebP images are allowed",
    },
  );

export const stepThreeSchema = z.object({
  uploadCoverImage: imageFileSchema.optional(),

  uploadLogoImage: imageFileSchema.optional(),

  phoneCode: z.string().optional(),

  phoneNumber: z
    .string()
    .min(1, { message: "phone is required" }),

  country: z.string().min(1, { message: "Country is required" }),

  city: z.string().min(1, { message: "City is required" }),

  dateEstablishment: z
    .string()
    .min(1, { message: "Date of establishment is required" }),

  aboutOrganization: z
    .string()
    .min(10, {
      message: "Please write at least 10 characters about your organization",
    })
    .max(1000, { message: "Description must be under 1000 characters" }),
});

export type TStepThreeSchema = z.infer<typeof stepThreeSchema>;
