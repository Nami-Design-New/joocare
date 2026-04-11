import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateBusinessVerificationPayload } from "../types";
import { updateBusinessVerificationService } from "../services/update-business-verification-service copy";


export const useUpdateBusinessVerification = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: UpdateBusinessVerificationPayload) => updateBusinessVerificationService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Business verification updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
