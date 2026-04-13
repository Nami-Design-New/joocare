import { apiFetch } from "@/shared/lib/fetch-manager";

export async function stepTwoService(
    payload: {
        commercial_registration_number: string
        commercial_registration_issue_date: string
        commercial_registration_expiry_date: string
        license_issue_country_id: string
        organization_size_id: string
        employer_type_id: string
        medical_facility_license_number: string
        license_issuing_authority: string
        specialty_id: string
        medical_license_issue_date: string
        medical_license_expiry_date: string
        commercial_registration_image: string
        medical_license_image: string
    },
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/auth/setup-business-verification`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token,
        }
    );
    console.log("payload step two ", payload);
    console.log("response step two ", response); if (!response.ok) {
        throw new Error(response.message ?? "Failed to update bio");
    }

    return response;
}