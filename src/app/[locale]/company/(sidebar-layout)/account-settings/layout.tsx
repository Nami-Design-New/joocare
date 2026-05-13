
import HeaderLayout from "@/shared/components/HeaderLayout"
import { navLinks } from "@/features/accout-settings/constants"
import { ReactNode } from "react"
import { getTranslations } from "next-intl/server";


const AccountSettingLayout = async ({ children }: { children: ReactNode }) => {
    const t = await getTranslations();
    const translatedNavLinks = navLinks.map((link) => ({
        ...link,
        label: t(link.label),
    }));

    return (
        <main className="flex flex-col space-y-6 bg-body-bg">
            <HeaderLayout navLinks={translatedNavLinks} />

            {children}
        </main>
    )
}

export default AccountSettingLayout
