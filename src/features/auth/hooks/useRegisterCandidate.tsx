import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { registerCandidateService } from "../services/candidate-register-service";

export const useRegisterCandidate = (onSuccess: () => void) => {
    const t = useTranslations();

    return useMutation({
        mutationFn: registerCandidateService,
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
