"use client"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { TCompanyProfileViewModel } from "../types"
import { EditAboutModal } from "./EditAboutModal"
import TextSkeleton from "./TextSkeleton"

const AboutSection = ({ companyProfileData, isPending }: { companyProfileData: TCompanyProfileViewModel, isPending: boolean }) => {
    const [open, setOpen] = useState(false)

    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">About</h2>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <p className="text-muted-foreground text-sm text-justify">{isPending ? <div className="w-full flex flex-col gap-2">
                <TextSkeleton />
                <TextSkeleton />
                <TextSkeleton />
            </div> : companyProfileData?.bio}</p>
        </div>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={companyProfileData?.bio}
        />
    </>
    )
}

export default AboutSection
