import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "This field is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
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

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
