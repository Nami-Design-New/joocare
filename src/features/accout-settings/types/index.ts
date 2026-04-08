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