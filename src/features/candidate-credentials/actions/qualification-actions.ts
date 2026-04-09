"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  createQualification,
  deleteQualification,
  updateQualification,
} from "../services/qualification-mutation-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

function revalidateQualificationPaths(locale: string) {
  revalidatePath(`/${locale}/candidate/credentials/qualifications`);
  revalidatePath(`/${locale}/candidate/profile`);
}

export async function createQualificationAction({
  degree,
  university,
  countryId,
  startDate,
  endDate,
  image,
  locale = "en",
}: {
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await createQualification({
    degree,
    university,
    countryId,
    startDate,
    endDate,
    image,
    locale,
    token,
  });

  revalidateQualificationPaths(locale);

  return {
    message: result?.message ?? "Qualification added successfully.",
  };
}

export async function updateQualificationAction({
  id,
  degree,
  university,
  countryId,
  startDate,
  endDate,
  image,
  locale = "en",
}: {
  id: string;
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await updateQualification(id, {
    degree,
    university,
    countryId,
    startDate,
    endDate,
    image,
    locale,
    token,
  });

  revalidateQualificationPaths(locale);

  return {
    message: result?.message ?? "Qualification updated successfully.",
  };
}

export async function deleteQualificationAction({
  id,
  locale = "en",
}: {
  id: string;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await deleteQualification({
    id,
    locale,
    token,
  });

  revalidateQualificationPaths(locale);

  return {
    message: result?.message ?? "Qualification deleted successfully.",
  };
}
