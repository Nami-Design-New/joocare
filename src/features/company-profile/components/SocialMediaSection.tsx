"use client"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { EditSocialMediaModal } from "./EditSocialMediaModal"
import SocialMediaCard from "./SocialMediaCard"

const SocialMediaSection = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">Social Media</h2>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <SocialMediaCard title="LinkedIn" link="https://www.linkedin.com/in/ahmed-eltatawe-30997923a/" src="/assets/icons/social-icons/linkedin.svg" />
            <SocialMediaCard title="Facebook" link="https://www.facebook.com/in/ahmed-eltatawe-30997923a/" src="/assets/icons/social-icons/facebook.svg" />
            <SocialMediaCard title="Instagram" link="https://www.instagram.com/in/ahmed-eltatawe-30997923a/" src="/assets/icons/social-icons/instagram.svg" />
            <SocialMediaCard title="X/Twitter" link="https://www.x.com/in/ahmed-eltatawe-30997923a/" src="/assets/icons/social-icons/twitter.svg" />
            <SocialMediaCard title="Snapchat" link="https://www.snapchat.com/in/ahmed-eltatawe-30997923a/" src="/assets/icons/social-icons/snap.svg" />

        </div>
        <EditSocialMediaModal open={open} onOpenChange={setOpen} />
    </>
    )
}

export default SocialMediaSection
