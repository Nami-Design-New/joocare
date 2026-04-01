
import { ReactNode } from "react"

import { navLinks } from "@/features/candidate-credentials/constants"
import HeaderLayout from "@/shared/components/HeaderLayout"
import AddHeaderButton from "@/features/candidate-credentials/components/AddHeaderButton"


const CredentialsLayout = ({ children }: { children: ReactNode }) => {

    return (
        <main className="flex flex-col space-y-6">
            <section className="flex justify-between sm:items-center flex-wrap sm:flex-nowrap gap-4">
                <HeaderLayout navLinks={navLinks} />
                <AddHeaderButton />
            </section>
            {children}
        </main>
    )
}

export default CredentialsLayout