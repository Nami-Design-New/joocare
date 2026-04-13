import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateEmailService } from "../services/update-email-service";
import { UpdateEmailPayload } from "../types";


export const useUpdateEmail = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: UpdateEmailPayload) => updateEmailService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Email updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
