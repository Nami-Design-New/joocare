import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getCandidateProfileService } from "../services/candidate-profile-service";
import type { CandidateProfileApiUser } from "../types/profile.types";

export default function useGetCandidateProfile({ token }: { token: string }) {
    const locale = useLocale();

    return useQuery({
        queryKey: ["candidate-profile", locale],
        queryFn: () =>
            getCandidateProfileService({
                token: token,
                locale,
            }),

        enabled: !!token,
    });
}
