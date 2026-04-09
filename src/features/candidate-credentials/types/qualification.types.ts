export type QualificationApiItem = {
  id: number | string;
  degree?: string | null;
  title?: string | null;
  name?: string | null;
  university?: string | null;
  institution?: string | null;
  country_id?: number | string | null;
  country?: {
    id?: number | string;
    name?: string | null;
    title?: string | null;
  } | string | null;
  start_date?: string | null;
  end_date?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type QualificationViewModel = {
  id: string;
  degree: string;
  university: string;
  countryId: string | null;
  countryName: string | null;
  startDate: string | null;
  endDate: string | null;
  period: string | null;
  image: string | null;
};

export type QualificationFormValues = {
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate: string;
  image: File[];
};
