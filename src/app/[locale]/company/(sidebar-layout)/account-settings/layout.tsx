
import HeaderLayout from "@/shared/components/HeaderLayout"
import { navLinks } from "@/features/accout-settings/constants"
import { ReactNode } from "react"


const AccountSettingLayout = ({ children }: { children: ReactNode }) => {

    return (
        <main className="flex flex-col space-y-6 bg-body-bg">
            <HeaderLayout navLinks={navLinks} />

            {children}
        </main>
    )
}

export default AccountSettingLayout