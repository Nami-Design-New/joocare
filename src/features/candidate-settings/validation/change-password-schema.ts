import { z } from 'zod';
import { isDifferentFromPreviousPassword } from '@/shared/lib/password-rules';
import { createPasswordSchema } from '@/shared/validation/password-schema';

type ChangePasswordMessages = {
  currentPasswordRequired: string;
  newPasswordRequired: string;
  newPasswordMin: string;
  newPasswordMax: string;
  passwordRules: string;
  newPasswordSameAsCurrent: string;
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
    .refine(
      (data) =>
        isDifferentFromPreviousPassword(data.newPassword, data.currentPassword),
      {
        message: messages.newPasswordSameAsCurrent,
        path: ['newPassword'],
      },
    )
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: messages.passwordsMismatch,
      path: ['confirmNewPassword'],
    });

export type TChangePasswordSchema = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
