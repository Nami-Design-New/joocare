
import HeaderLayout from "@/shared/components/HeaderLayout"
import { navLinks } from "@/features/candidate-settings/constants"
import { ReactNode } from "react"


const SettingsLayout = ({ children }: { children: ReactNode }) => {

    return (
        <main className="flex flex-col space-y-6">
            <HeaderLayout navLinks={navLinks} />

            {children}
        </main>
    )
}

export default SettingsLayout