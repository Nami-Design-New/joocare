import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { TRegisterEmployerSchema } from "../validation/employer-register-schema";

export const registerEmployerService = async (data: TRegisterEmployerSchema) => {
    const response = await fetch(`${getCompanyApiUrl()}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};
