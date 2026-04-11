import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getBusinessVerificationService } from "../services/bussiness-verification-service";

export default function useGetBusinessVerification({ token }: { token: string }) {
    const locale = useLocale();

    return useQuery({
        queryKey: ["business-verification", token, locale],
        queryFn: () =>
            getBusinessVerificationService({
                token: token!,
                locale,
            }),

        enabled: !!token,
    });
}