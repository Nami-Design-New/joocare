import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSocialLinksService } from "../services/update-social-links-service";

export const useUpdateSocialLinks = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { website: string; facebook: string; twitter: string; linkedin: string; instagram: string; snapchat: string; }) => updateSocialLinksService(payload, { token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-profile"] });
        },
        onError: (error) => {
            // toast.error(error.message);
        },
    });
};
