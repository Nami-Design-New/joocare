// 🔹 Generic API Response
export type ApiResponse<T> = {
    data: T;
    message: string;
};

// 🔹 Sub Types
export type TDomain = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
};

export type TCountry = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
};

export type TCity = {
    id: number;
    name: string;
    country_id: number;
    created_at: string;
    updated_at: string;
};

export type TOrganizationSize = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
};

export type TEmployerType = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
};

export type TSpecialty = {
    id: number;
    title: string;
    category_id: number;
    created_at: string;
    updated_at: string;
};

// 🔹 Main Company Type
export type TCompanyProfileViewModel = {
    id: number;
    name: string;
    email: string;
    phone: string;
    phone_code: string;

    person_name: string;
    person_phone: string;
    person_phone_code: string;

    domain_id: number;
    domain: TDomain;

    country_id: number;
    country: TCountry;

    city_id: number;
    city: TCity;

    bio: string;
    established_date: string;

    commercial_registration_number: string;
    commercial_registration_issue_date: string;
    commercial_registration_expiry_date: string;
    commercial_registration_image: string;

    license_issue_country_id: number;
    license_issue_country: TCountry;

    organization_size_id: number;
    organization_size: TOrganizationSize;

    employer_type_id: number;
    employer_type: TEmployerType;

    medical_facility_license_number: string;
    license_issuing_authority: string;

    specialty_id: number;
    specialty: TSpecialty;

    medical_license_issue_date: string;
    medical_license_expiry_date: string;
    medical_license_image: string;

    website: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    snapchat: string;

    image: string;
    cover: string;

    status: string;
    rejection_reason: string | null;

    is_active: number;

    created_at: string;
    updated_at: string;
};

// 🔹 Final Response Type
export type TCompanyProfileResponse = ApiResponse<{
    company: TCompanyProfileViewModel;
}>;

// 🔹 Optional shortcut (most used)
export type TCompanyProfile = TCompanyProfileViewModel;