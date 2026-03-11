import { z } from "zod";

export const stepTwoSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});
