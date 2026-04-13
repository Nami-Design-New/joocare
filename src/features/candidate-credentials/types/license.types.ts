export type LicenseApiItem = {
  id: number | string;
  title?: string | null;
  name?: string | null;
  number?: string | null;
  license_number?: string | null;
  country_id?: number | string | null;
  country?: {
    id?: number | string;
    name?: string | null;
    title?: string | null;
  } | string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type LicenseViewModel = {
  id: string;
  title: string;
  number: string;
  countryId: string | null;
  countryName: string | null;
  image: string | null;
};

export type LicenseFormValues = {
  title: string;
  number: string;
  countryId: string;
  image: File[];
};
