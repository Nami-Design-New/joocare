import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateBasicInfoPayload } from "../types";
import { updateBasicInfoService } from "../services/update-basic-info-service";


export const useUpdateBasicInfo = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: UpdateBasicInfoPayload) => updateBasicInfoService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Basic info updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
