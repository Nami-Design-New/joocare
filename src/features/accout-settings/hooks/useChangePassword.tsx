import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChangePasswordPayload } from "../types";
import { changePasswordService } from "../services/change-password-service";
import { useRouter } from "@/i18n/navigation";


export const useChangePassword = ({ token }: { token: string }) => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => changePasswordService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Password changed successfully");
            router.push("/company/company-profile");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
