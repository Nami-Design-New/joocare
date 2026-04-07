import { TRegisterCandidateSchema } from "../validation/candidate-register-schema";

export const registerCandidateService = async (data: TRegisterCandidateSchema) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_USER_URL}/auth/register`, {
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