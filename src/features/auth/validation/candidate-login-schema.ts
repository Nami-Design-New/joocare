import { z } from "zod";

type CreateLoginCandidateSchemaOptions = {
  fieldRequired?: string;
  emailInvalid?: string;
  passwordMin?: string;
  passwordMax?: string;
};

export const createLoginCandidateSchema = ({
  fieldRequired = "This field is required",
  emailInvalid = "Not valid email",
  passwordMin = "Password is required",
}: CreateLoginCandidateSchemaOptions = {}) =>
  z.object({
    email: z
      .string()
      .min(1, { message: fieldRequired })
      .email({ message: emailInvalid }),
    password: z
      .string()
      .min(1, { message: passwordMin })
  });

export const loginCandidateSchema = createLoginCandidateSchema();

export type TLoginCandidateSchema = z.infer<typeof loginCandidateSchema>;
