import { z } from "zod";

const passwordPattern = /^[A-Za-z\u0600-\u06FF0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;

type CreateNewPasswordSchemaOptions = {
  passwordRequired?: string;
  passwordMin?: string;
  passwordMax?: string;
  passwordPattern?: string;
  confirmPasswordRequired?: string;
  passwordsDoNotMatch?: string;
};

export const createNewPasswordSchema = ({
  passwordRequired = "Password is required",
  passwordMin = "Password must be at least 6 characters",
  passwordMax = "Password must be at most 15 characters",
  passwordPattern: passwordPatternMessage = "Password can include English, Arabic, numbers, special characters, or any mix of them",
  confirmPasswordRequired = "Confirm password is required",
  passwordsDoNotMatch = "Passwords do not match",
}: CreateNewPasswordSchemaOptions = {}) =>
  z
    .object({
      newPassword: z
        .string()
        .min(1, { message: passwordRequired })
        .min(6, { message: passwordMin })
        .max(15, { message: passwordMax })
        .regex(passwordPattern, {
          message: passwordPatternMessage,
        }),
      confirmNewPassword: z
        .string()
        .min(1, { message: confirmPasswordRequired }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: passwordsDoNotMatch,
      path: ["confirmNewPassword"],
    });

export const NewPasswordSchema = createNewPasswordSchema();

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
