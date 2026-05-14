import { z } from "zod";

type CreateForgetPasswordSchemaOptions = {
  emailRequired?: string;
  emailInvalid?: string;
};

export const createForgetPasswordSchema = ({
  emailRequired = "Email is required",
  emailInvalid = "Please enter a valid email address",
}: CreateForgetPasswordSchemaOptions = {}) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: emailRequired })
      .email({ message: emailInvalid }),
  });

export const ForgetPasswordSchema = createForgetPasswordSchema();

export type TForgetPasswordSchema = z.infer<typeof ForgetPasswordSchema>;
