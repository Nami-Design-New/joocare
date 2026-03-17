
import HeaderLayout from "@/features/accout-settings/components/HeaderLayout"
import { ReactNode } from "react"


const AccountSettingLayout = ({ children }: { children: ReactNode }) => {

    return (
        <main className="flex flex-col space-y-6 bg-body-bg">
            <HeaderLayout />

            {children}
        </main>
    )
}

export default AccountSettingLayout