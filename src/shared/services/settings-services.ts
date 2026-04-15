import { getBaseApiUrl } from "../lib/api-endpoints";
import { apiFetch } from "../lib/fetch-manager";

export type AppSetting = {
  id: number;
  logo: string;
  fav_icon: string;
  footer_logo: string;
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

export const settingService = async () => {
  const { data, ok, message } = await apiFetch<AppSetting[]>(
    `${getBaseApiUrl()}/setting`,
    {
      method: "GET",
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to fetch settings");
  }

  return data?.data?.[0] ?? null;
};
