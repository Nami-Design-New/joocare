"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { removeCv, uploadCv } from "../services/cv-service";

async function resolveCandidateToken(passedToken?: string) {
  if (passedToken) {
    return passedToken;
  }

  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function updateCvAction(formData: FormData, accessToken?: string) {
  const token = await resolveCandidateToken(accessToken);

  const locale = typeof formData.get("locale") === "string" ? String(formData.get("locale")) : "en";
  const cvPath = typeof formData.get("cv") === "string" ? String(formData.get("cv")) : "";

  if (!cvPath.trim()) {
    throw new Error("CV path is required.");
  }

  const response = await uploadCv({
    cvPath,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: response.message,
  };
}

export async function deleteCvAction(locale = "en", accessToken?: string) {
  const token = await resolveCandidateToken(accessToken);

  const response = await removeCv({
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: response.message,
  };
}
