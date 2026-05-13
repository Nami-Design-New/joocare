import { z } from "zod";

type CreatePasswordOtpSchemaOptions = {
  codeRequired?: string;
  codeLength?: string;
};

export const createPasswordOtpSchema = ({
  codeRequired = "Code is required",
  codeLength = "Code must be 5 digits",
}: CreatePasswordOtpSchemaOptions = {}) =>
  z.object({
    otp: z.string({
      message: codeRequired,
    }).length(5, codeLength),
  });

export const PasswordOtpSchema = createPasswordOtpSchema();

export type TPasswordOtpSchema = z.infer<typeof PasswordOtpSchema>;
