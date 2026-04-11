"use client";

import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type StoredImageResponse = {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
};

export async function storeUploadedFile({
  file,
  locale = "en",
}: {
  file: File;
  locale?: string;
}) {
  const uploadFormData = new FormData();
  uploadFormData.append("image", file);

  const { ok, data, message } = await apiFetch<StoredImageResponse>(
    `${getBaseApiUrl()}/images`,
    {
      method: "POST",
      locale,
      body: uploadFormData,
    },
  );

  const storedFilePath = data?.data?.image;

  if (!ok || !storedFilePath) {
    throw new Error(message || "Failed to upload file.");
  }

  return {
    path: storedFilePath,
    message: message || data?.message || "Success",
  };
}
