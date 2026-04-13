import "server-only";

import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { QualificationViewModel } from "../types/qualification.types";
import { extractQualificationItems, mapQualification } from "./qualification-utils";

export async function getCandidateQualifications() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    return [];
  }

  const locale = await getLocale();
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/qualifications`,
    {
      method: "GET",
      locale,
      token: String(session.accessToken),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load qualifications.");
  }

  return extractQualificationItems(data)
    .map(mapQualification)
    .filter((item): item is QualificationViewModel => Boolean(item));
}
