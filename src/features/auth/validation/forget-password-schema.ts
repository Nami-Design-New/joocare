import { z } from "zod";

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email({ message: "Not valid email" }),
});

export type TForgetPasswordSchema = z.infer<typeof ForgetPasswordSchema>;
