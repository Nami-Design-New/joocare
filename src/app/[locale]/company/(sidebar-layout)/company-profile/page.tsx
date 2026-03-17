import AboutSection from "@/features/company-profile/components/AboutSection"
import BaseInfoSection from "@/features/company-profile/components/BaseInfoSection"
import ProfileHeader from "@/features/company-profile/components/ProfileHeader"
import SocialMediaSection from "@/features/company-profile/components/SocialMediaSection"

const MyProfilePage = () => {
    return (
        <div className="space-y-6">
            <ProfileHeader />
            <AboutSection />
            <div className="grid grid-cols-9 gap-6">
                <div className="col-span-9 lg:col-span-5">
                    <SocialMediaSection />
                </div>

                <div className="col-span-9 lg:col-span-4">
                    <BaseInfoSection />
                </div>
            </div>
        </div>
    )
}

export default MyProfilePage
