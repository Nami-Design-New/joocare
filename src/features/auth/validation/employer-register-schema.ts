import { z } from "zod";

type CreateRegisterEmployerSchemaOptions = {
  companyNameRequired?: string;
  companyNameMin?: string;
  companyNameMax?: string;
  emailRequired?: string;
  emailInvalid?: string;
  domainRequired?: string;
  personFullNameRequired?: string;
  personFullNameMin?: string;
  personFullNameMax?: string;
  phoneRequired?: string;
  phoneMax?: string;
  passwordMin?: string;
  passwordMax?: string;
  confirmAuthorized?: string;
  termsRequired?: string;
};

export const createRegisterEmployerSchema = ({
  companyNameRequired = "company name is required",
  companyNameMin = "company name must be at least 3 characters",
  companyNameMax = "company name must be less than 100 characters",
  emailRequired = "email is required",
  emailInvalid = "Not valid email",
  domainRequired = "Domain is required",
  personFullNameRequired = "Person full name is required",
  personFullNameMin = "Person full name must be at least 3 characters",
  personFullNameMax = "Person full name must be less than 100 characters",
  phoneRequired = "Phone number is required",
  phoneMax = "Phone number must be less than 15 characters",
  passwordMin = "Password must be at least 6 characters",
  passwordMax = "Password must be less than 15 characters",
  confirmAuthorized = "You must confirm that you are authorized to represent this company",
  termsRequired = "You must accept the Privacy Policy and Terms & Conditions",
}: CreateRegisterEmployerSchemaOptions = {}) =>
  z.object({
    companyName: z
      .string()
      .nonempty({ message: companyNameRequired })
      .min(3, { message: companyNameMin })
      .max(100, { message: companyNameMax }),
    officialEmail: z
      .string()
      .min(1, { message: emailRequired })
      .email({ message: emailInvalid }),
    domain: z.string({
      message: domainRequired,
    }).min(1, { message: domainRequired }),
    personFullName: z
      .string({
        message: personFullNameRequired,
      })
      .nonempty({ message: personFullNameRequired })
      .min(3, { message: personFullNameMin })
      .max(100, { message: personFullNameMax }),
    phoneNumber: z.string({
      message: phoneRequired,
    }).min(7, { message: phoneRequired })
      .max(15, { message: phoneMax }),
    createPassword: z
      .string()
      .min(6, { message: passwordMin })
      .max(15, { message: passwordMax }),
    confirmRegister: z.boolean({
      message: confirmAuthorized,
    }).refine((val) => val === true, {
      message: confirmAuthorized,
    }),
    termsAndConditions: z.boolean({
      message: termsRequired,
    }).refine((val) => val === true, {
      message: termsRequired,
    }),
  });

export const RegisterEmployerSchema = createRegisterEmployerSchema();

export type TRegisterEmployerSchema = z.infer<typeof RegisterEmployerSchema>;
