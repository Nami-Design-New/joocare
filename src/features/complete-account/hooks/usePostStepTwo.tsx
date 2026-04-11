import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stepOneService } from "../services/step-one-service";
import { stepTwoService } from "../services/step-two-service";
import { toast } from "sonner";

export const usePostStepTwo = ({ token }: { token: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            commercial_registration_number: string
            commercial_registration_issue_date: string
            commercial_registration_expiry_date: string
            license_issue_country_id: string
            organization_size_id: string
            employer_type_id: string
            medical_facility_license_number: string
            license_issuing_authority: string
            specialty_id: string
            medical_license_issue_date: string
            medical_license_expiry_date: string
            commercial_registration_image: string
            medical_license_image: string
        }) => stepTwoService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
