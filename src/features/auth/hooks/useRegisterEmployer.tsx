import { useMutation } from "@tanstack/react-query";
import { registerEmployerService } from "../services/employer-register-service";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export const useRegisterEmployer = (onSuccess: () => void) => {
    const t = useTranslations();

    return useMutation({
        mutationFn: registerEmployerService,
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
