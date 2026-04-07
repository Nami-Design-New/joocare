import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePasswordService } from "../services/change-password-service";

export const useChangePassword = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: {
            current_password: string;
            password: string;
            password_confirmation: string;
        }) => changePasswordService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Password changed successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
