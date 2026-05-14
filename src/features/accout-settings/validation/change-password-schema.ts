import { z } from "zod";

type CreateChangePasswordSchemaOptions = {
  messages?: {
    currentPasswordRequired: string;
    newPasswordRequired: string;
    newPasswordMin: string;
    newPasswordMax: string;
    confirmNewPasswordRequired: string;
    passwordsDoNotMatch: string;
  };
};

export const createChangePasswordSchema = ({
  messages,
}: CreateChangePasswordSchemaOptions = {}) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: messages?.currentPasswordRequired ?? "Current password is required" }),
      newPassword: z
        .string()
        .min(1, { message: messages?.newPasswordRequired ?? "New password is required" })
        .min(6, { message: messages?.newPasswordMin ?? "New password must be at least 6 characters" })
        .max(15, { message: messages?.newPasswordMax ?? "New password must be at most 15 characters" }),
      confirmNewPassword: z
        .string()
        .min(1, {
          message: messages?.confirmNewPasswordRequired ?? "Confirm new password is required",
        }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: messages?.passwordsDoNotMatch ?? "Passwords do not match",
      path: ["confirmNewPassword"],
    });

export const ChangePasswordSchema = createChangePasswordSchema();

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
