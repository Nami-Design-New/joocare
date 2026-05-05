export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqApiItem = {
  id?: number | string;
  question?: string | null;
  answer?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FaqsApiResponse = {
  message?: string;
  code?: number;
  data?: FaqApiItem[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

export type FaqsPageData = {
  items: FaqItem[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
};
export type RequiredFaqsApiResponse = {
  data: FaqApiItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};