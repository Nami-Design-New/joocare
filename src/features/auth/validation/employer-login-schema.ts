import { z } from "zod";

type CreateLoginEmployerSchemaOptions = {
  fieldRequired?: string;
  emailInvalid?: string;
  passwordMin?: string;
  passwordMax?: string;
};

export const createLoginEmployerSchema = ({
  fieldRequired = "This field is required",
  emailInvalid = "Not valid email",
  passwordMin = "Password must be at least 6 characters",
  passwordMax = "Password must be at most 15 characters",
}: CreateLoginEmployerSchemaOptions = {}) =>
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

export const loginEmployerSchema = createLoginEmployerSchema();

export type TLoginEmployerSchema = z.infer<typeof loginEmployerSchema>;
