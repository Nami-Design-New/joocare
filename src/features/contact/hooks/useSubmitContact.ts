import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContactFormValues } from "../types";
import { submitContactService } from "../services/contact-service";
import { useTranslations } from "next-intl";

export function useSubmitContact(onSuccess: () => void) {
  const locale = useLocale();
  const t = useTranslations();

  return useMutation({
    mutationFn: (data: ContactFormValues) => submitContactService({ data, locale }),
    onSuccess: () => {
      toast.success(t("contactPage.toast.success"));
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("contactPage.toast.error"));
    },
  });
}
