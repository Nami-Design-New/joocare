import { z } from "zod";

export const ApplyNowSchema = z.object({
  uploadCV: z.any().refine((file) => file, "CV is required and max size is (5MB)"),
});

export type TApplyNowSchema = z.infer<typeof ApplyNowSchema>;
