import { z } from "zod";

export const loginEmployerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email({ message: "Not valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(15, { message: "Password must be at most 15 characters" }),
});

export type TLoginEmployerSchema = z.infer<typeof loginEmployerSchema>;
