import { z } from "zod";

export const PasswordOtpSchema = z.object({
  otp: z.string().length(5, "Code must be 5 digits"),
});

export type TPasswordOtpSchema = z.infer<typeof PasswordOtpSchema>;
