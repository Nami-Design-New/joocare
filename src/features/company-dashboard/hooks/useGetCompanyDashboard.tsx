import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getCompanyDashboardService } from "../services/company-dashboard-service";

export default function useGetCompanyDashboard({ token }: { token: string }) {
    const locale = useLocale();

    return useQuery({
        queryKey: ["company-dashboard", token, locale],
        queryFn: () =>
            getCompanyDashboardService({
                token: token!,
                locale,
            }),

        enabled: !!token,
    });
}