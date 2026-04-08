"use client"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { EditSocialMediaModal } from "./EditSocialMediaModal"
import SocialMediaCard from "./SocialMediaCard"
import { TCompanyProfileViewModel } from "../types"

const SocialMediaSection = ({ companyProfileData, isPending }: { companyProfileData: TCompanyProfileViewModel, isPending: boolean }) => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">Social Media</h2>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <SocialMediaCard title="LinkedIn" link={companyProfileData?.linkedin} src="/assets/icons/social-icons/linkedin.svg" isPending={isPending} />
            <SocialMediaCard title="Facebook" link={companyProfileData?.facebook} src="/assets/icons/social-icons/facebook.svg" isPending={isPending} />
            <SocialMediaCard title="Instagram" link={companyProfileData?.instagram} src="/assets/icons/social-icons/instagram.svg" isPending={isPending} />
            <SocialMediaCard title="X/Twitter" link={companyProfileData?.twitter} src="/assets/icons/social-icons/twitter.svg" isPending={isPending} />
            <SocialMediaCard title="Snapchat" link={companyProfileData?.snapchat} src="/assets/icons/social-icons/snap.svg" isPending={isPending} />

        </div>
        <EditSocialMediaModal open={open} onOpenChange={setOpen} companyProfileData={companyProfileData} />
    </>
    )
}

export default SocialMediaSection
