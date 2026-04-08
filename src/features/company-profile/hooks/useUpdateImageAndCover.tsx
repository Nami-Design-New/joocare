import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateImageAndCoverService } from "../services/update-image-and-cover-service";

export const useUpdateImageAndCover = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { cover?: string, image?: string }) => updateImageAndCoverService(payload, { token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-profile"] });
        },
    });
};
