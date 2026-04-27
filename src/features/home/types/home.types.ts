export type HomeSelectOption = {
  id: string;
  label: string;
};

export type HomePopularSearch = {
  id: string;
  label: string;
  count: number;
};

export type HomePopularSearchesPage = {
  items: HomePopularSearch[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type HomeStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type HomeWhyModel = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type HomeEmployer = {
  id: string;
  image: string | null;
};

export type HomeRecentJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  timeLabel: string;
  image: string;
  updated_at: string;
};

export type HomeRate = {
  id?: number | string;
  rate?: string | number | null;
  comment?: string | null;
  created_at?: string | null;
  name?: string | null;
  date?: string | null;
  text?: string | null;
};

export type HomeFaq = {
  id: string;
  question: string;
  answer: string;
};

export type HomePageData = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    countries: HomeSelectOption[];
    categories: HomeSelectOption[];
    domains: HomeSelectOption[];
  };
  howItWorks: {
    title: string;
    steps: HomeStep[];
  };
  whyJoocare: {
    title: string;
    legacyModelTitle: string;
    legacyModelDescription: string;
    legacyModels: HomeWhyModel[];
    joocareModelTitle: string;
    joocareModelDescription: string;
    joocareModels: HomeWhyModel[];
  };
  topEmployers: {
    title: string;
    companies: HomeEmployer[];
  };
  impact: {
    title: string;
    description: string;
  };
  recentJobs: {
    title: string;
    jobs: HomeRecentJob[];
  };
  rates: {
    title: string;
    items: HomeRate[];
  };
  faqs: {
    title: string;
    items: HomeFaq[];
  };
};
