"use client"

import AboutSection from "@/features/company-profile/components/AboutSection"
import BaseInfoSection from "@/features/company-profile/components/BaseInfoSection"
import ProfileHeader from "@/features/company-profile/components/ProfileHeader"
import SocialMediaSection from "@/features/company-profile/components/SocialMediaSection"
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile"
import { TCompanyProfileViewModel } from "@/features/company-profile/types"
import { useSession } from "next-auth/react"

const MyProfilePage = () => {
    const { data: session } = useSession();

    const { data: companyProfileData } = useGetCompanyProfile(session?.accessToken);


    return (
        <div className="space-y-6">
            <ProfileHeader companyProfileData={companyProfileData as TCompanyProfileViewModel} />
            <AboutSection companyProfileData={companyProfileData as TCompanyProfileViewModel} />
            <div className="grid grid-cols-9 gap-6">
                <div className="col-span-9 lg:col-span-5">
                    <SocialMediaSection companyProfileData={companyProfileData as TCompanyProfileViewModel} />
                </div>

                <div className="col-span-9 lg:col-span-4">
                    <BaseInfoSection companyProfileData={companyProfileData as TCompanyProfileViewModel} />
                </div>
            </div>
        </div>
    )
}

export default MyProfilePage
