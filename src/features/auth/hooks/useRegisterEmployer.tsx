import { useMutation } from "@tanstack/react-query";
import { registerEmployerService } from "../services/employer-register-service";
import { toast } from "sonner";

export const useRegisterEmployer = (onSuccess: () => void) => {
    return useMutation({
        mutationFn: registerEmployerService,
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