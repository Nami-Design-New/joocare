import { privacyService } from "@/features/privacy-and-conditions/services/privacy-service"

export default async function TermsConditions() {
    const privacyPolicy = await privacyService()
    // console.log(privacyPolicy)
    return (
        <section className="layout-shell py-20">
            <h1>Privacy Policy</h1>
            <div
                className="prose prose-sm max-w-none border-b pb-5"
                dangerouslySetInnerHTML={{
                    __html:
                        privacyPolicy?.privacy ||
                        "<p>No description available.</p>",
                }}
            />
        </section>
    )
}
