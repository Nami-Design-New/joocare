import {z} from "zod";

export const loginEmployerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email({ message: "Not valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be less than 21 characters" }),
});

export type TLoginEmployerSchema = z.infer<typeof loginEmployerSchema>;
