import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getCompanyProfileService } from "../services/company-profile-service";

export default function useGetCompanyProfile({ token }: { token?: string }) {
    const locale = useLocale();

    return useQuery({
        queryKey: ["company-profile", token, locale],
        queryFn: () =>
            getCompanyProfileService({
                token: token!,
                locale,
            }),

        enabled: !!token,
    });
}