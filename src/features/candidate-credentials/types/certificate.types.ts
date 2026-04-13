export type CertificateApiItem = {
  id: number | string;
  name?: string | null;
  title?: string | null;
  company?: string | null;
  organization?: string | null;
  issuer?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CertificateViewModel = {
  id: string;
  name: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  period: string | null;
  image: string | null;
};

export type CertificateFormValues = {
  name: string;
  company: string;
  startDate: string;
  endDate: string;
  image: File[];
};
