import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerCandidateService } from "../services/candidate-register-service";

export const useRegisterCandidate = (onSuccess: () => void) => {
    return useMutation({
        mutationFn: registerCandidateService,
        onSuccess: (data) => {
            console.log("data", data);
            toast.success("Registration successful! Please verify your email.");
            onSuccess();
        },
        onError: (error: Error) => {
            console.log("error:::::::", error);
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};