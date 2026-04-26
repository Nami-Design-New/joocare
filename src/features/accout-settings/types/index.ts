export type ChangePasswordPayload = {
    current_password: string;
    password: string;
    password_confirmation: string;
}
export type UpdateBasicInfoPayload = {
    name: string;
    email: string;
    domain_id: number;
    person_name: string;
    person_phone: string;
    person_phone_code: string;
    phone: string;
    phone_code: string
    country_id: number;
    city_id: number;
    established_date: string;
}

export type UpdateEmailPayload = {
    email: string;
}

export type UpdateBusinessVerificationPayload = {
    commercial_registration_number: string;
    commercial_registration_issue_date: string;
    commercial_registration_expiry_date: string;
    license_issue_country_id: number;
    organization_size_id: number;
    employer_type_id: number;
    medical_facility_license_number: string;
    license_issuing_authority: string;
    specialty_id: number;
    medical_license_issue_date: string;
    medical_license_expiry_date: string;
    medical_license_image?: string;
    commercial_registration_image?: string;
}

