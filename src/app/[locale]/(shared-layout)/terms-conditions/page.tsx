import { privacyService } from "@/features/privacy-and-conditions/services/privacy-service"
import { termsService } from "@/features/privacy-and-conditions/services/terms-service"

export default async function TermsConditions() {
    const terms = await termsService()
    return (
        <section className="layout-shell py-20">
            <h1>Terms And Conditions</h1>
            <div
                className="prose prose-sm max-w-none border-b pb-5"
                dangerouslySetInnerHTML={{
                    __html:
                        terms?.terms ||
                        "<p>No description available.</p>",
                }}
            />
        </section>
    )
}
