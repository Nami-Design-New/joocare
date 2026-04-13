import { cn } from '@/shared/lib/utils'
import Image from 'next/image'
import { CompanyProfile } from '../company-profile.type'

export default function HeaderSection({ company }: { company: CompanyProfile }) {
    return (
        <>
            <div className="w-full h-72 mb-20">
                <div className="relative">
                    {/* COVER */}
                    <div
                        className={cn(
                            "relative w-full h-75 rounded-[40px] bg-muted border",
                            "flex items-center justify-center  overflow-hidden",
                            "hover:bg-border transition")}
                    >
                        <Image
                            src={company?.cover ?? "/assets/cover.svg"}
                            alt={`${company.name}'s cover image`}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* LOGO */}
                    <div
                        className={cn(
                            "absolute -bottom-16 left-8",
                            "w-37.5 h-37.5 rounded-full border bg-white",
                            "flex items-center justify-center ",
                            "ring-4 ring-white"
                        )}
                    >
                        <Image
                            src={company?.image ?? "/assets/image_2.svg"}
                            alt={`${company.name}'s logo image`}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>

                </div>
                <div className="hidden lg:flex items-center justify-start mt-2">
                    <div className="w-48"></div>
                    <h2 className="text-[28px] font-semibold">{company.name}</h2>
                </div>
            </div>

            <h2 className="text-[28px] font-semibold lg:mb-0 mb-8 lg:opacity-0">{company.name}</h2>

        </>
    )
}
