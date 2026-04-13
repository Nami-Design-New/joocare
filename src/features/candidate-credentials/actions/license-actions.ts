"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  createLicense,
  deleteLicense,
  updateLicense,
} from "../services/license-mutation-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

function revalidateLicensePaths(locale: string) {
  revalidatePath(`/${locale}/candidate/credentials/licenses`);
  revalidatePath(`/${locale}/candidate/profile`);
}

export async function createLicenseAction({
  title,
  number,
  countryId,
  image,
  locale = "en",
}: {
  title: string;
  number: string;
  countryId: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await createLicense({
    title,
    number,
    countryId,
    image,
    locale,
    token,
  });

  revalidateLicensePaths(locale);

  return {
    message: result?.message ?? "License added successfully.",
  };
}

export async function updateLicenseAction({
  id,
  title,
  number,
  countryId,
  image,
  locale = "en",
}: {
  id: string;
  title: string;
  number: string;
  countryId: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await updateLicense(id, {
    title,
    number,
    countryId,
    image,
    locale,
    token,
  });

  revalidateLicensePaths(locale);

  return {
    message: result?.message ?? "License updated successfully.",
  };
}

export async function deleteLicenseAction({
  id,
  locale = "en",
}: {
  id: string;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await deleteLicense({
    id,
    locale,
    token,
  });

  revalidateLicensePaths(locale);

  return {
    message: result?.message ?? "License deleted successfully.",
  };
}
