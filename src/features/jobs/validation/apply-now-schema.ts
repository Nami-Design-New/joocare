import { z } from "zod";

export const ApplyNowSchema = z.object({
  uploadCV: z.any().refine((file) => file, "CV is required"),
});

export type TApplyNowSchema = z.infer<typeof ApplyNowSchema>;
