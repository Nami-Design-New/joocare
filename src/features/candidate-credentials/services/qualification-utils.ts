import type {
  QualificationApiItem,
  QualificationViewModel,
} from "../types/qualification.types";

const STORAGE_BASE_URL = "https://joocare.nami-tec.com/storage";

export function extractQualificationItems(payload: unknown): QualificationApiItem[] {
  if (Array.isArray(payload)) {
    return payload as QualificationApiItem[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.data,
    record.qualifications,
    record.qualification,
    record.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as QualificationApiItem[];
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      Array.isArray((candidate as Record<string, unknown>).data)
    ) {
      return (candidate as { data: QualificationApiItem[] }).data;
    }
  }

  return [];
}

function normalizeDateLabel(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
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

export function mapQualification(item: QualificationApiItem): QualificationViewModel | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const degree = item.degree ?? item.title ?? item.name ?? "Qualification";
  const university = item.university ?? item.institution ?? "Institution";
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
  const startLabel = normalizeDateLabel(item.start_date ?? null);
  const endLabel = item.end_date ? normalizeDateLabel(item.end_date) : "Present";
  const period =
    startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel ?? endLabel ?? null;

  return {
    id: String(item.id),
    degree,
    university,
    countryId,
    countryName,
    startDate: item.start_date ?? null,
    endDate: item.end_date ?? null,
    period,
    image: resolveStoredFileUrl(item.image ?? null),
  };
}
