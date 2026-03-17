"use client"

import { usePathname } from "@/i18n/navigation"
import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/shared/components/ui/button"

const navLinks = [
    { href: "/company/account-settings/basic-info", label: "Basic Info" },
    { href: "/company/account-settings/business-verification", label: "Business Verification" },
    { href: "/company/account-settings/change-password", label: "Change Password" },
]

const HeaderLayout = () => {
    const pathname = usePathname()

    return (
        <header className="p-2 rounded-full shadow bg-white w-fit flex items-center flex-wrap gap-3">
            {navLinks.map(({ href, label }) => {
                const isActive = pathname === href

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`${buttonVariants({
                            variant: isActive ? "default" : "outline",
                            size: "pill",
                        })}`}
                    >
                        {label}
                    </Link>
                )
            })}
        </header>

    )
}

export default HeaderLayout