
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { TRegisterCandidateSchema } from "../validation/candidate-register-schema";

export const registerCandidateService = async (data: TRegisterCandidateSchema) => {
    const response = await fetch(`${getUserApiUrl()}/auth/register`, {

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

