import { z } from "zod";

export const aboutModalSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(1000, "Bio must be at most 1000 characters.")
    .refine((value) => value.length === 0 || value.length >= 3, {
      message: "Bio must be at least 3 characters.",
    }),
});

export type AboutModalFormData = z.infer<typeof aboutModalSchema>;
