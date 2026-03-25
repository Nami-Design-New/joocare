"use client"

import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
interface ILinkItem {
    label: string
    href: string
    icon?: LucideIcon
    image?: string
}

interface ILinksProps {
    links: ILinkItem[]
}

const SidebarLinks = ({ links }: ILinksProps) => {
    const pathname = usePathname()
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, "")

    return (
        <nav aria-label="Company navigation">
            <ul className="flex flex-col gap-5">
                {links.map(({ label, href, image, icon: Icon }) => {
                    const isActive = normalizedPathname === href

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
                                {image && (
                                    <div
                                        className="w-5 h-5 bg-black group-hover:bg-[oklch(0.468_0.148_145)] transition-colors"
                                        style={{
                                            WebkitMaskImage: `url(${image})`,
                                            WebkitMaskRepeat: "no-repeat",
                                            WebkitMaskPosition: "center",
                                            WebkitMaskSize: "contain",
                                            maskImage: `url(${image})`,
                                            maskRepeat: "no-repeat",
                                            maskPosition: "center",
                                            maskSize: "contain",
                                        }}
                                    />
                                )}


                                {Icon && (
                                    <Icon className="size-5 shrink-0 transition-colors group-hover:text-primary" />
                                )}
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