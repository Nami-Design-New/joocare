import { termsService } from "@/features/privacy-and-conditions/services/terms-service"
import { getTranslations } from "next-intl/server";

export const revalidate = 300;

export default async function TermsConditions() {
    const t = await getTranslations();
    const terms = await termsService()
    return (
        <section className="layout-shell py-20">
            <h1>{t("legalPages.terms-conditions-title")}</h1>
            <div
                className="prose prose-sm max-w-none border-b pb-5"
                dangerouslySetInnerHTML={{
                    __html:
                        terms?.terms ||
                        `<p>${t("legalPages.no-description-available")}</p>`,
                }}
            />
        </section>
    )
}
