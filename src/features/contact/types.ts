export type ContactRole = "candidate" | "employer";

export type ContactInitialValues = {
  name?: string;
  email?: string;
};

export type ContactFormValues =
  {
    role: ContactRole;
    name: string;
    email: string;
    phone: string;
    countryId: string;
    cityId: string;
    inquiryTypeId: string;
    message: string;
  };
