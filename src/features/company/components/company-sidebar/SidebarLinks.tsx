"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, Settings, User, UserRoundCog } from "lucide-react"

const links = [
    {
        label: "Company Profile",
        href: "/company/company-profile",
        icon: User,
    },
    {
        label: "Dashboard",
        href: "/company/dashboard",
        icon: Gauge,
    },
    {
        label: "Job Management",
        href: "/company/job-management",
        icon: UserRoundCog,
    },
    {
        label: "Account Settings",
        href: "/company/account-settings/basic-info",
        icon: Settings,
    },
]

const SidebarLinks = () => {
    const pathname = usePathname()

    return (
        <nav aria-label="Company navigation">
            <ul className="flex flex-col gap-2">
                {links.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href

                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`
                                            group flex items-center gap-3 px-4 py-2 rounded-full
                                            text-lg font-semibold transition-all
                                            border-l-2
                                            ${isActive
                                        ? "border-primary bg-primary-bg text-primary"
                                        : "border-transparent text-muted-foreground hover:border-primary hover:bg-primary-bg hover:text-primary"
                                    }
                                            `}
                            >
                                <Icon className="size-5 shrink-0 transition-colors group-hover:text-primary" />
                                <span>{label}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default SidebarLinks