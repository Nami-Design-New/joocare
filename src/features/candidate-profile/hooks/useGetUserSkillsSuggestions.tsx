import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getUserSkillsSuggestionsService } from "../services/user-skills-suggetions";

export default function useGetUserSkillsSuggestions({ token }: { token: string }) {
    const locale = useLocale();

    return useQuery({
        queryKey: ["user-skills-suggestions", locale],
        queryFn: () =>
            getUserSkillsSuggestionsService({
                token: token,
                locale,
            }),

        enabled: !!token,
    });
}