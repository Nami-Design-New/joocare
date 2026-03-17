import { JobFormData } from "../validation/job-post-schema";

const STORAGE_KEY = "post-job-form";

export default function useFormPersist(defaultValues: Partial<JobFormData>) {
  const load = (): Partial<JobFormData> => {
    if (typeof window === "undefined") return defaultValues;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultValues;
    } catch {
      return defaultValues;
    }
  };

  const save = (data: Partial<JobFormData>) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clear = () => sessionStorage.removeItem(STORAGE_KEY);

  return { load, save, clear };
}
