import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function hasAllowedExtension(file: File) {
  const lowerCaseName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((extension) => lowerCaseName.endsWith(extension));
}

export const cvSchema = z.object({
  cv: z
    .instanceof(File)
    .refine((file) => hasAllowedExtension(file), {
      message: "CV must be a PDF or Word document.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "CV must be 5 MB or smaller.",
    }),
});

export type CvFormData = z.infer<typeof cvSchema>;

export function isPdfFileName(fileName: string) {
  return fileName.toLowerCase().endsWith(".pdf");
}
