import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContactFormValues } from "../types";
import { submitContactService } from "../services/contact-service";

export function useSubmitContact(onSuccess: () => void) {
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: ContactFormValues) => submitContactService({ data, locale }),
    onSuccess: () => {
      toast.success("Your message has been sent successfully.");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });
}
