import { cache } from "react";

import { getBaseApiUrl } from "../lib/api-endpoints";
import { apiFetch } from "../lib/fetch-manager";
import { runWithInFlightDedupe } from "../lib/in-flight-dedupe";

export type AppSetting = {
  id: number;
  logo: string;
  fav_icon: string;
  footer_logo: string;
  share_link_image?: string | null;
  footer_text: string;
  copyright: string;
  verified_healthcare_professionals: number;
  active_job_opportunities: number;
  healthcare_specializations_covered: number;
  hiring_success_rate: number;
  linkedin: string;
  facebook: string;
  instagram: string;
  snapchat: string;
  twitter: string;
  created_at: string;
  updated_at: string;
};

export const settingService = cache(async (locale: string) => {
  const { data, ok, message } = await runWithInFlightDedupe(
    `setting:${locale}`,
    () =>
      apiFetch<AppSetting[]>(
        `${getBaseApiUrl()}/setting`,
        {
          method: "GET",
          locale,
          cache: "force-cache",
        },
      ),
  );

  if (!ok) {
    throw new Error(message || "Failed to fetch settings");
  }

  return data?.data?.[0] ?? null;
});
