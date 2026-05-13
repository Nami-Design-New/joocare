import { z } from "zod";

type ChangePasswordMessages = {
  currentPasswordRequired: string;
  newPasswordRequired: string;
  newPasswordMin: string;
  newPasswordMax: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export const createChangePasswordSchema = (messages: ChangePasswordMessages) => z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: messages.currentPasswordRequired }),
    newPassword: z
      .string(messages.newPasswordRequired)
      .min(6, { message: messages.newPasswordMin })
      .max(15, { message: messages.newPasswordMax }),
    confirmNewPassword: z
      .string(messages.confirmPasswordRequired)
      .min(1, { message: messages.confirmPasswordRequired }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: messages.passwordsMismatch,
    path: ["confirmNewPassword"],
  });

export const ChangePasswordSchema = createChangePasswordSchema({
  currentPasswordRequired: "current password is required",
  newPasswordRequired: "new password is required",
  newPasswordMin: "new password is must be at least 6 characters",
  newPasswordMax: "new password is must be at most 15 characters",
  confirmPasswordRequired: "confirm new password is required",
  passwordsMismatch: "Passwords do not match",
});

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
