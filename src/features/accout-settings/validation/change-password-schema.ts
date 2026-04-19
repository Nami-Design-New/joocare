import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string("current password is required")
      .min(1, { message: "current password is required" }),
    newPassword: z
      .string("new password is required")
      .min(6, { message: "new password is must be at least 6 characters" })
      .max(15, { message: "new password is must be at most 15 characters" }),
    confirmNewPassword: z
      .string("confirm new password is required")
      .min(1, { message: "confirm new password is required" }),

  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
