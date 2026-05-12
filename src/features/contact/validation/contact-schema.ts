import { z } from "zod";

export const contactSchema = z
  .object({
    role: z.enum(["candidate", "employer"]),
    name: z.string().trim().min(2, "Name is required"),
    email: z.email("Email is invalid"),
    phone: z.string(),
    countryId: z.string(),
    cityId: z.string(),
    inquiryTypeId: z.string().min(1, "Inquiry type is required"),
    inquiryTypeTitle: z.string(),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters"),
  })
  .superRefine((data, context) => {
    if (
      data.inquiryTypeId === "__other__" &&
      data.inquiryTypeTitle.trim().length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["inquiryTypeTitle"],
        message: "Other inquiry type is required",
      });
    }

    if (data.role !== "employer") {
      return;
    }

    if (data.phone.trim().length < 6) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Phone number is required",
      });
    }

    if (data.countryId.trim().length === 0) {
      context.addIssue({
        code: "custom",
        path: ["countryId"],
        message: "Current location is required",
      });
    }

    if (data.cityId.trim().length === 0) {
      context.addIssue({
        code: "custom",
        path: ["cityId"],
        message: "City is required",
      });
    }
  });

export type TContactSchema = z.infer<typeof contactSchema>;
