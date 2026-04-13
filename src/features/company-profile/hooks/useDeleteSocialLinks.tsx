import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSocialLinksService } from "../services/delete-social-links-service";

export const useDeleteSocialLinks = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { social: string }) => deleteSocialLinksService(payload, { token }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["company-profile"] });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
