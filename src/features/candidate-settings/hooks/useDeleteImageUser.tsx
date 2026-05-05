"use client"
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteImageUserService } from "../services/delete-image-user";


export const useDeleteImageUser = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: () => deleteImageUserService({ token }),
        onSuccess: (res) => {
            toast.success(res.message ?? "Image deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};
