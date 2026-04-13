import { useUploadImage } from "@/shared/hooks/useUploadImage";
import { toast } from "sonner";
import { useState } from "react";
import { useUpdateImageAndCover } from "./useUpdateImageAndCover";

type Params = {
    token: string;
};

export function useUpdateCompanyImagesFlow({ token }: Params) {
    const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
    const { mutateAsync: updateImages, isPending: isUpdating } =
        useUpdateImageAndCover({ token });

    const [loadingField, setLoadingField] = useState<
        "cover" | "logo" | null
    >(null);

    const handleChangeImage = async (
        file: File,
        type: "cover" | "logo"
    ) => {
        try {
            setLoadingField(type === "cover" ? "cover" : "logo");

            // 1- Upload image
            const uploadRes = await uploadImage(file);
            const imageUrl = uploadRes?.data?.data?.image as string;

            if (!imageUrl) throw new Error("Upload failed");

            // 2- Send to update API
            await updateImages({
                ...(type === "cover" && { cover: imageUrl }),
                ...(type === "logo" && { image: imageUrl }),
            });

            if (type === "cover") {
                toast.success("Cover updated successfully ");
            } else {
                toast.success("Logo updated successfully ");
            }
            return true;
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
            return false;
        } finally {
            setLoadingField(null);
        }
    };

    return {
        handleChangeImage,
        loadingField,
        isUploading,
        isUpdating,
    };
}