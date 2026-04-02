import { cn } from '@/shared/lib/utils'
import Image from 'next/image'

export default function HeaderSection() {
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
                            src={"/assets/cover.svg"}
                            alt="Cover"
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
                            src={"/assets/image_2.svg"}
                            alt="Logo"
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>

                </div>
                <div className="hidden lg:flex items-center justify-start mt-2">
                    <div className="w-48"></div>
                    <h2 className="text-[28px] font-semibold">Saudi German Hospital</h2>
                </div>
            </div>

            <h2 className="text-[28px] font-semibold lg:mb-0 mb-8 lg:opacity-0">Saudi German Hospital</h2>

        </>
    )
}
