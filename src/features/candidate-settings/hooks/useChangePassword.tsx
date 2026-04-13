import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePasswordService } from "../services/change-password-service";
import { ChangePasswordPayload } from "../types";


export const useChangePassword = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => changePasswordService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Password changed successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
