import { z } from 'zod';
import { createPasswordSchema } from '@/shared/validation/password-schema';

type CreateNewPasswordSchemaOptions = {
  passwordRequired?: string;
  passwordMin?: string;
  passwordMax?: string;
  passwordRules?: string;
  confirmPasswordRequired?: string;
  passwordsDoNotMatch?: string;
};

export const createNewPasswordSchema = ({
  passwordRequired = 'Password is required',
  passwordMin = 'Password must be at least 8 characters',
  passwordMax = 'Password must be at most 15 characters',
  passwordRules,
  confirmPasswordRequired = 'Confirm password is required',
  passwordsDoNotMatch = 'Passwords do not match',
}: CreateNewPasswordSchemaOptions = {}) =>
  z
    .object({
      newPassword: createPasswordSchema({
        required: passwordRequired,
        min: passwordMin,
        max: passwordMax,
        rules: passwordRules,
      }),
      confirmNewPassword: z
        .string()
        .min(1, { message: confirmPasswordRequired }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: passwordsDoNotMatch,
      path: ['confirmNewPassword'],
    });

export const NewPasswordSchema = createNewPasswordSchema();

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
