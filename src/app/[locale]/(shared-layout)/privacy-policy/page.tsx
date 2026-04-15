import { privacyService } from "@/features/privacy-and-conditions/services/privacy-service"

export default async function TermsConditions() {
    const privacyPolicy = await privacyService()
    console.log(privacyPolicy)
    return (
        <section className="layout-shell py-20">
            <h1>Privacy Policy</h1>
            <p>{privacyPolicy?.privacy}</p>
        </section>
    )
}
