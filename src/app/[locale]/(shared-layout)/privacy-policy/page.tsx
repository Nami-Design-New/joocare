import { privacyService } from "@/features/privacy-and-conditions/services/privacy-service"
import { getTranslations } from "next-intl/server";

export const revalidate = 300;

export default async function TermsConditions() {
    const t = await getTranslations();
    const privacyPolicy = await privacyService()
    // console.log(privacyPolicy)
    return (
        <section className="layout-shell py-20">
            <h1>{t("legalPages.privacy-policy-title")}</h1>
            <div
                className="prose prose-sm max-w-none border-b pb-5"
                dangerouslySetInnerHTML={{
                    __html:
                        privacyPolicy?.privacy ||
                        `<p>${t("legalPages.no-description-available")}</p>`,
                }}
            />
        </section>
    )
}
