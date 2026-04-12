import HeaderLayout from "@/shared/components/HeaderLayout"
import { ReactNode } from "react"
import { getTranslations } from "next-intl/server"


const SettingsLayout = async ({ children }: { children: ReactNode }) => {
    const tCandidate = await getTranslations("Candidate");
    const navLinks = [
        { href: "/candidate/settings/basic-info", label: tCandidate("basicInfo") },
        { href: "/candidate/settings/change-password", label: tCandidate("changePassword") },
    ];

    return (
        <main className="flex flex-col space-y-6">
            <HeaderLayout navLinks={navLinks} />

            {children}
        </main>
    )
}

export default SettingsLayout
