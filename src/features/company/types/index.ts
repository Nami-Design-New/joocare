
export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    phone_code: string | null;
    domain: string;
    person_name: string;
    person_phone: string;
    person_phone_code: string;
    country_id: number | null;
    city_id: number | null;
    bio: string | null;
    established_date: string | null;
    commercial_registration_number: string | null;
    commercial_registration_issue_date: string | null;
    commercial_registration_expiry_date: string | null;
    commercial_registration_image: string;
    license_issue_country_id: number | null;
    organization_size_id: number | null;
    employer_type_id: number | null;
    medical_facility_license_number: string | null;
    license_issuing_authority: string | null;
    specialty_id: number | null;
    medical_license_issue_date: string | null;
    medical_license_expiry_date: string | null;
    medical_license_image: string;
    website: string | null;
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
    snapchat: string | null;
    image: string;
    cover: string;
    created_at: string;
    updated_at: string;
}