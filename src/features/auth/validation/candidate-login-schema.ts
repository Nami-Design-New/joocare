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
  passwordMin = "Password must be at least 6 characters",
  passwordMax = "Password must be at most 15 characters",
}: CreateLoginCandidateSchemaOptions = {}) =>
  z.object({
    email: z
      .string()
      .min(1, { message: fieldRequired })
      .email({ message: emailInvalid }),
    password: z
      .string()
      .min(6, { message: passwordMin })
      .max(15, { message: passwordMax }),
  });

export const loginCandidateSchema = createLoginCandidateSchema();

export type TLoginCandidateSchema = z.infer<typeof loginCandidateSchema>;
