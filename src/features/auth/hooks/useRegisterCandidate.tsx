import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
    RegisterCandidatePayload,
    registerCandidateService,
} from "../services/candidate-register-service";

export const useRegisterCandidate = (onSuccess: () => void) => {
    const t = useTranslations();
    const locale = useLocale();

    return useMutation({
        mutationFn: (data: RegisterCandidatePayload) =>
            registerCandidateService(data, locale),
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
