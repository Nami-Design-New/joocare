import { z } from 'zod';
import { createPasswordSchema } from '@/shared/validation/password-schema';

type CreateChangePasswordSchemaOptions = {
  messages?: {
    currentPasswordRequired: string;
    newPasswordRequired: string;
    newPasswordMin: string;
    newPasswordMax: string;
    passwordRules: string;
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
        .min(1, {
          message:
            messages?.currentPasswordRequired ?? 'Current password is required',
        }),
      newPassword: createPasswordSchema({
        required: messages?.newPasswordRequired,
        min: messages?.newPasswordMin,
        max: messages?.newPasswordMax,
        rules: messages?.passwordRules,
      }),
      confirmNewPassword: z.string().min(1, {
        message:
          messages?.confirmNewPasswordRequired ??
          'Confirm new password is required',
      }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: messages?.passwordsDoNotMatch ?? 'Passwords do not match',
      path: ['confirmNewPassword'],
    });

export const ChangePasswordSchema = createChangePasswordSchema();

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
