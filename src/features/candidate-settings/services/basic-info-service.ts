import "server-only";

import type { CandidateProfileViewModel } from "@/features/candidate-profile/types/profile.types";
import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type CandidateSettingsOption = {
  id: string;
  label: string;
};

export type CandidateSettingsProfile = {
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  jobTitleId: string;
  specialtyId: string;
  experienceId: string;
  countryId: string;
  cityId: string;
  birthDate: string;
  image: string | null;
  cv: string | null;
};

export type CandidateBasicInfoOptions = {
  jobTitles: CandidateSettingsOption[];
  specialties: CandidateSettingsOption[];
  experiences: CandidateSettingsOption[];
  countries: CandidateSettingsOption[];
  cities: CandidateSettingsOption[];
};

type StoredImageResponse = {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
};

const STORAGE_BASE_URL = "https://joocare.nami-tec.com/storage";







function normalizeDate(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function resolveStoredFileUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${STORAGE_BASE_URL}/${path.replace(/^\/+/, "")}`;
}



export function mapCandidateProfileToSettingsProfile(
  profile: CandidateProfileViewModel,
): CandidateSettingsProfile {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    phoneCode: profile.phoneCode ?? "",
    jobTitleId: profile.jobTitleId ?? "",
    specialtyId: profile.specialtyId ?? "",
    experienceId: profile.experienceId ?? "",
    countryId: profile.countryId ?? "",
    cityId: profile.cityId ?? "",
    birthDate: normalizeDate(profile.birthDate),
    image: resolveStoredFileUrl(profile.image),
    cv: resolveStoredFileUrl(profile.cv),
  };
}

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



export async function updateCandidateBasicInfo({
  formData,
  locale = "en",
  token,
}: {
  formData: FormData;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/auth/update-profile`,
    {
      method: "POST",
      locale,
      token,
      body: formData,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to update profile information.");
  }

  return {
    data,
    message: message || data?.message || "Profile updated successfully.",
  };
}
