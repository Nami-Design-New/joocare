import { apiFetch } from "../lib/fetch-manager";

// services/upload-image-service.ts
export const uploadImageService = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await apiFetch(`${baseUrl}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData,
    });

    console.log("res upload image", res);
    if (!res.ok) {
        throw new Error("Upload failed");
    }

    return res;
};