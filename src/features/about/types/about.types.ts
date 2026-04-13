export type AboutFeature = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
};

export type AboutImage = {
  id: string;
  image: string;
  alt: string;
};

export type AboutPillar = {
  id: string;
  title: string;
  content: string;
};

export type AboutPageData = {
  aboutSection: {
    title: string;
    description: string;
    items: AboutFeature[];
    images: AboutImage[];
  };
  chooseUs: {
    title: string;
    items: AboutPillar[];
    images: AboutImage[];
  };
  vision: {
    title: string;
    description: string;
    images: AboutImage[];
  };
  mission: {
    title: string;
    description: string;
    images: AboutImage[];
  };
};
