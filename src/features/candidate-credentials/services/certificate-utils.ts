import type {
  CertificateApiItem,
  CertificateViewModel,
} from "../types/certificate.types";

const STORAGE_BASE_URL = "https://joocare.nami-tec.com/storage";

export function extractCertificateItems(payload: unknown): CertificateApiItem[] {
  if (Array.isArray(payload)) {
    return payload as CertificateApiItem[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.data,
    record.certifications,
    record.certification,
    record.certificates,
    record.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as CertificateApiItem[];
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      Array.isArray((candidate as Record<string, unknown>).data)
    ) {
      return (candidate as { data: CertificateApiItem[] }).data;
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

export function mapCertificate(item: CertificateApiItem): CertificateViewModel | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const startLabel = normalizeDateLabel(item.start_date ?? null);
  const endLabel = item.end_date ? normalizeDateLabel(item.end_date) : "Present";
  const period =
    startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel ?? endLabel ?? null;

  return {
    id: String(item.id),
    name: item.name ?? item.title ?? "Certificate",
    company: item.company ?? item.organization ?? item.issuer ?? "Issuing organization",
    startDate: item.start_date ?? null,
    endDate: item.end_date ?? null,
    period,
    image: resolveStoredFileUrl(item.image ?? null),
  };
}
