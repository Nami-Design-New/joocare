import { z } from 'zod';
import {
  meetsPasswordRequirements,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../lib/password-rules';

type PasswordSchemaMessages = {
  required?: string;
  min?: string;
  max?: string;
  rules?: string;
};

export function createPasswordSchema({
  required = 'Password is required',
  min = 'Password must be at least 8 characters',
  max = 'Password must be at most 15 characters',
  rules = 'Include an uppercase letter, a lowercase letter, a number, and a special character',
}: PasswordSchemaMessages = {}) {
  return z
    .string({ message: required })
    .min(1, { message: required })
    .min(PASSWORD_MIN_LENGTH, { message: min })
    .max(PASSWORD_MAX_LENGTH, { message: max })
    .refine(meetsPasswordRequirements, { message: rules });
}
