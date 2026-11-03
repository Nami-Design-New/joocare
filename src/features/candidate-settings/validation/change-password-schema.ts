import { z } from 'zod';
import { createPasswordSchema } from '@/shared/validation/password-schema';

type ChangePasswordMessages = {
  currentPasswordRequired: string;
  newPasswordRequired: string;
  newPasswordMin: string;
  newPasswordMax: string;
  passwordRules: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export const createChangePasswordSchema = (messages: ChangePasswordMessages) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: messages.currentPasswordRequired }),
      newPassword: createPasswordSchema({
        required: messages.newPasswordRequired,
        min: messages.newPasswordMin,
        max: messages.newPasswordMax,
        rules: messages.passwordRules,
      }),
      confirmNewPassword: z
        .string(messages.confirmPasswordRequired)
        .min(1, { message: messages.confirmPasswordRequired }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: messages.passwordsMismatch,
      path: ['confirmNewPassword'],
    });

export const ChangePasswordSchema = createChangePasswordSchema({
  currentPasswordRequired: 'current password is required',
  newPasswordRequired: 'new password is required',
  newPasswordMin: 'new password must be at least 8 characters',
  newPasswordMax: 'new password is must be at most 15 characters',
  passwordRules:
    'Include an uppercase letter, a lowercase letter, a number, and a special character',
  confirmPasswordRequired: 'confirm new password is required',
  passwordsMismatch: 'Passwords do not match',
});

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
