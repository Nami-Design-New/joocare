"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { storeUploadedFile, updateCandidateBasicInfo } from "../services/basic-info-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function storeUploadedFileAction(
  formData: FormData,
  locale = "en",
) {
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file selected.");
  }

  return storeUploadedFile({
    file,
    locale,
  });
}

export async function updateCandidateBasicInfoAction(formData: FormData, locale = "en") {
  const token = await resolveCandidateToken();
  const nextFormData = new FormData();

  for (const [key, value] of formData.entries()) {
    nextFormData.append(key, value);
  }

  const response = await updateCandidateBasicInfo({
    formData: nextFormData,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/settings/basic-info`);
  revalidatePath(`/${locale}/candidate/profile`);

  return response;
}
