import type { LicenseApiItem, LicenseViewModel } from "../types/license.types";

const STORAGE_BASE_URL = "https://joocare.nami-tec.com/storage";

export function extractLicenseItems(payload: unknown): LicenseApiItem[] {
  if (Array.isArray(payload)) {
    return payload as LicenseApiItem[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.data,
    record["user-licenses"],
    record.user_licenses,
    record.licenses,
    record.license,
    record.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as LicenseApiItem[];
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      Array.isArray((candidate as Record<string, unknown>).data)
    ) {
      return (candidate as { data: LicenseApiItem[] }).data;
    }
  }

  return [];
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

export function mapLicense(item: LicenseApiItem): LicenseViewModel | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const countryName =
    typeof item.country === "string"
      ? item.country
      : item.country?.name ?? item.country?.title ?? null;
  const countryId =
    item.country_id !== undefined && item.country_id !== null
      ? String(item.country_id)
      : item.country && typeof item.country === "object" && item.country.id !== undefined
        ? String(item.country.id)
        : null;

  return {
    id: String(item.id),
    title: item.title ?? item.name ?? "License",
    number: item.number ?? item.license_number ?? "No license number",
    countryId,
    countryName,
    image: resolveStoredFileUrl(item.image ?? null),
  };
}
