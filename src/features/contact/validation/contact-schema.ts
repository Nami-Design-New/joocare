import { z } from "zod";

type CreateContactSchemaOptions = {
  nameRequired?: string;
  emailInvalid?: string;
  inquiryTypeRequired?: string;
  messageMin?: string;
  otherInquiryTypeRequired?: string;
  phoneRequired?: string;
  currentLocationRequired?: string;
  cityRequired?: string;
};

export const createContactSchema = ({
  nameRequired = "Name is required",
  emailInvalid = "Email is invalid",
  inquiryTypeRequired = "Inquiry type is required",
  messageMin = "Message must be at least 10 characters",
  otherInquiryTypeRequired = "Other inquiry type is required",
  phoneRequired = "Phone number is required",
  currentLocationRequired = "Current location is required",
  cityRequired = "City is required",
}: CreateContactSchemaOptions = {}) =>
  z
    .object({
      role: z.enum(["candidate", "employer"]),
      name: z.string().trim().min(2, nameRequired),
      email: z.email(emailInvalid),
      phone: z.string(),
      countryId: z.string(),
      cityId: z.string(),
      inquiryTypeId: z.string().min(1, inquiryTypeRequired),
      inquiryTypeTitle: z.string(),
      message: z
        .string()
        .trim()
        .min(10, messageMin),
    })
    .superRefine((data, context) => {
      if (
        data.inquiryTypeId === "__other__" &&
        data.inquiryTypeTitle.trim().length === 0
      ) {
        context.addIssue({
          code: "custom",
          path: ["inquiryTypeTitle"],
          message: otherInquiryTypeRequired,
        });
      }

      if (data.role !== "employer") {
        return;
      }

      if (data.phone.trim().length < 6) {
        context.addIssue({
          code: "custom",
          path: ["phone"],
          message: phoneRequired,
        });
      }

      if (data.countryId.trim().length === 0) {
        context.addIssue({
          code: "custom",
          path: ["countryId"],
          message: currentLocationRequired,
        });
      }

      if (data.cityId.trim().length === 0) {
        context.addIssue({
          code: "custom",
          path: ["cityId"],
          message: cityRequired,
        });
      }
    });

export const contactSchema = createContactSchema();

export type TContactSchema = z.infer<typeof contactSchema>;
