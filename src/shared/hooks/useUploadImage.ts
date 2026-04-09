// hooks/useUploadImage.ts
import { useMutation } from "@tanstack/react-query";
import { uploadImageService } from "../services/upload-image-service";

export const useUploadImage = () => {
    return useMutation({
        mutationFn: (file: File) => uploadImageService(file),
    });
};