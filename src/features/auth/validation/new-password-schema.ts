import { z } from "zod";

export const NewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "This field is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "This field is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
