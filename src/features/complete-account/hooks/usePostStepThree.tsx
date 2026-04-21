import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stepThreeService } from "../services/step-three-service";
import { useRouter } from "@/i18n/navigation";

export const usePostStepThree = ({ token }: { token: string }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            facebook?: string;
            twitter?: string;
            linkedin?: string;
            instagram?: string;
            snapchat?: string;
            website?: string;
            phone: string;
            phone_code: string;
            country_id: number;
            city_id: number;
            established_date: string;
            bio: string;
            cover?: string;
            image?: string;
        }) => stepThreeService(payload, { token }),
        onSuccess: async (res) => {
            toast.success(res.message);
            await queryClient.invalidateQueries({ queryKey: ["company-profile"] });
            router.push("/company/company-profile");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
