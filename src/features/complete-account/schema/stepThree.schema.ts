import { z } from "zod";

// const imageFileSchema = z
//   .instanceof(File)
//   .refine((file) => file.size <= 5 * 1024 * 1024, {
//     message: "Image must be less than 5MB",
//   })
//   .refine(
//     (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
//     {
//       message: "Only JPEG, PNG, or WebP images are allowed",
//     },
//   );

export const stepThreeSchema = z.object({
  uploadCoverImage: z.instanceof(File, { message: "Cover image is required" }),

  uploadLogoImage: z.instanceof(File, { message: "Logo image is required" }),

  organizationPhoneNumber: z.string().min(1, { message: "phone is required" }),

  organizationCountry: z.string().min(1, { message: "Country is required" }),

  organizationCity: z.string().min(1, { message: "City is required" }),

  dateOfEstablishment: z
    .string()
    .min(1, { message: "Date of establishment is required" }),

  aboutOrganization: z
    .string()
    .min(10, {
      message: "Please write at least 10 characters about your organization",
    })
    .max(1000, { message: "Description must be under 1000 characters" }),

  website: z
    .string()
    .min(1, { message: "website is required" }),
  linkedIn: z
    .string()
    .min(1, { message: "linkedIn is required" }),
  facebook: z
    .string()
    .min(1, { message: "facebook is required" }),
  XTwitter: z
    .string()
    .min(1, { message: "XTwitter is required" }),
  instagram: z
    .string()
    .min(1, { message: "instagram is required" }),
  snapchat: z
    .string()
    .min(1, { message: "snapchat is required" }),
});
