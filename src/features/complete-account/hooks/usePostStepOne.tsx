import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stepOneService } from "../services/step-one-service";
import { toast } from "sonner";

export const usePostStepOne = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            name: string;
            email: string;
            domain_id: string;
            person_name: string;
            person_phone: string;
            person_phone_code: string;
        }) => stepOneService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
