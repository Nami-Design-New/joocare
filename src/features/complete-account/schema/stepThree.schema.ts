import { optional, z } from "zod";

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
const optionalUrl = z
  .string()
  .trim()
  .transform((val) => {
    if (!val) return val;
    if (!val.startsWith("http")) {
      return `https://${val}`;
    }
    return val;
  })
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid URL",
    }
  );
export const stepThreeSchema = z.object({
  uploadCoverImage: z.string().optional(),

  uploadLogoImage: z.string().optional(),

  organizationPhoneNumber: z.string().optional(),

  organizationCountry: z.string().min(1, { message: "Country is required" }),

  organizationCity: z.string().min(1, { message: "City is required" }),

  dateOfEstablishment: z
    .string()
    .trim()
    .min(1, { message: "Date of establishment is required" })
    .refine((val) => {
      const year = Number(val);
      return !isNaN(year);
    }, {
      message: "Please enter a valid year",
    })
    .refine((val) => {
      const year = Number(val);
      return year >= 1900;
    }, {
      message: "Please enter a year greater than or equal to 1900",
    })
    .refine((val) => {
      const year = Number(val);
      const currentYear = new Date().getFullYear();
      return year <= currentYear;
    }, {
      message: "Year cannot be in the future",
    }),
  aboutOrganization: z
    .string()
    .min(10, {
      message: "Please write at least 10 characters about your organization",
    })
    .max(1500, { message: "Description must be under 1500 characters" }),

  website: optionalUrl,
  linkedIn: optionalUrl,
  facebook: optionalUrl,
  XTwitter: optionalUrl,
  instagram: optionalUrl,
  snapchat: optionalUrl,

});
