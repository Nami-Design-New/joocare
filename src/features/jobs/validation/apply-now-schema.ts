import { z } from "zod";

export const ApplyNowSchema = z.object({
  uploadCV: z.any().refine((file) => file, "CV is required and max size is (10MB)"),
});

export type TApplyNowSchema = z.infer<typeof ApplyNowSchema>;
