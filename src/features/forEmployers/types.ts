export type EmployerHomeImage = {
  id: string;
  image: string;
  alt: string;
};

export type EmployerImageApiModel = {
  id?: number | string;
  image?: string | null;
  alt?: string | null;
};

export type EmployerHomeItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
};

export type EmployerItemApiModel = {
  id?: number | string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
};

export type EmployerFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type EmployerFaqApiModel = {
  id?: number | string;
  question?: string | null;
  answer?: string | null;
};

export type EmployersHeroSectionProps = {
  title: string;
  description: string;
  images: EmployerHomeImage[];
};

export type BannerSectionProps = {
  title: string;
  description: string;
  image: EmployerHomeImage | null;
};

export type WhySectionProps = {
  title: string;
  description: string;
  items: EmployerHomeItem[];
};

export type HireSectionProps = {
  title: string;
  description: string;
  items: EmployerHomeItem[];
};

export type FAQSectionProps = {
  title: string;
  items: EmployerFaqItem[];
};

export type FeatureItemProps = {
  title: string;
  desc: string;
};

export type ForEmployersPageData = {
  hero: {
    title: string;
    description: string;
    images: EmployerHomeImage[];
  };
  banner: {
    title: string;
    description: string;
    image: EmployerHomeImage | null;
  };
  whyJoocare: {
    title: string;
    description: string;
    items: EmployerHomeItem[];
  };
  hireSteps: {
    title: string;
    description: string;
    items: EmployerHomeItem[];
  };
  faqs: {
    title: string;
    items: EmployerFaqItem[];
  };
};

export type ForEmployersApiResponse = {
  home_section?: {
    title?: string | null;
    description?: string | null;
    images?: EmployerImageApiModel[];
  };
  hire_professional_section?: {
    title?: string | null;
    description?: string | null;
    image?: EmployerImageApiModel | null;
  };
  why_joocare?: {
    title?: string | null;
    description?: string | null;
    items?: EmployerItemApiModel[];
  };
  hire_steps_section?: {
    title?: string | null;
    description?: string | null;
    items?: EmployerItemApiModel[];
  };
  faqs_section?: {
    title?: string | null;
    items?: EmployerFaqApiModel[];
  };
};
