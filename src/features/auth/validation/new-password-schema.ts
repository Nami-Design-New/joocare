import { z } from "zod";

const passwordPattern = /^[A-Za-z\u0600-\u06FF0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;

export const NewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(15, { message: "Password must be at most 15 characters" })
      .regex(passwordPattern, {
        message:
          "Password can include English, Arabic, numbers, special characters, or any mix of them",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
