import { z } from 'zod';

type CreateLoginEmployerSchemaOptions = {
  fieldRequired?: string;
  emailInvalid?: string;
  passwordMin?: string;
  passwordMax?: string;
};

export const createLoginEmployerSchema = ({
  fieldRequired = 'This field is required',
  emailInvalid = 'Not valid email',
  passwordMin = 'Password is required',
}: CreateLoginEmployerSchemaOptions = {}) =>
  z.object({
    email: z
      .string()
      .min(1, { message: fieldRequired })
      .email({ message: emailInvalid }),
    password: z.string().min(1, { message: passwordMin }),
  });

export const loginEmployerSchema = createLoginEmployerSchema();

export type TLoginEmployerSchema = z.infer<typeof loginEmployerSchema>;
