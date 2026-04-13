import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBioService } from "../services/update-bio-service";

export const useUpdateBio = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { bio: string }) => updateBioService(payload, { token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-profile"] });
        },
    });
};
