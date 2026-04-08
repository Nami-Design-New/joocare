"use client"
import { Edit2 } from "lucide-react"
import { EditAboutModal } from "./EditAboutModal"
import { useState } from "react"
import { TCompanyProfileViewModel } from "../types"

const AboutSection = ({ companyProfileData }: { companyProfileData: TCompanyProfileViewModel }) => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">About</h2>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <p className="text-muted-foreground text-sm text-justify">{companyProfileData?.bio}</p>
        </div>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={companyProfileData?.bio}
        />
    </>
    )
}

export default AboutSection
