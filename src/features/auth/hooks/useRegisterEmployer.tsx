import { useMutation } from "@tanstack/react-query";
import {
    RegisterEmployerPayload,
    registerEmployerService,
} from "../services/employer-register-service";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export const useRegisterEmployer = (onSuccess: () => void) => {
    const t = useTranslations();
    const locale = useLocale();

    return useMutation({
        mutationFn: (data: RegisterEmployerPayload) =>
            registerEmployerService(data, locale),
        onSuccess: () => {
            toast.success(t("authPage.toasts.registration-success"));
            onSuccess();
        },
        onError: (error: Error) => {
            console.log("error:::::::", error);
            toast.error(error.message ?? t("authPage.toasts.something-went-wrong"));
        },
    });
};
