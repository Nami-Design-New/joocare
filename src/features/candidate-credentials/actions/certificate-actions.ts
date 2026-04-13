"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  createCertificate,
  deleteCertificate,
  updateCertificate,
} from "../services/certificate-mutation-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

function revalidateCertificatePaths(locale: string) {
  revalidatePath(`/${locale}/candidate/credentials/certificates`);
  revalidatePath(`/${locale}/candidate/profile`);
}

export async function createCertificateAction({
  name,
  company,
  startDate,
  endDate,
  image,
  locale = "en",
}: {
  name: string;
  company: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await createCertificate({
    name,
    company,
    startDate,
    endDate,
    image,
    locale,
    token,
  });

  revalidateCertificatePaths(locale);

  return {
    message: result?.message ?? "Certificate added successfully.",
  };
}

export async function updateCertificateAction({
  id,
  name,
  company,
  startDate,
  endDate,
  image,
  locale = "en",
}: {
  id: string;
  name: string;
  company: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await updateCertificate(id, {
    name,
    company,
    startDate,
    endDate,
    image,
    locale,
    token,
  });

  revalidateCertificatePaths(locale);

  return {
    message: result?.message ?? "Certificate updated successfully.",
  };
}

export async function deleteCertificateAction({
  id,
  locale = "en",
}: {
  id: string;
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  const result = await deleteCertificate({
    id,
    locale,
    token,
  });

  revalidateCertificatePaths(locale);

  return {
    message: result?.message ?? "Certificate deleted successfully.",
  };
}
