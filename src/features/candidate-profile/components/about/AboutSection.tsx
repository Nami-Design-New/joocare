"use client"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { EditAboutModal } from "./EditAboutModal"
import type { CandidateProfileViewModel } from "../../types/profile.types"

const AboutSection = ({
    profile,
}: {
    profile: CandidateProfileViewModel | null
}) => {
    const [open, setOpen] = useState(false)
    const bioText = profile?.bio ?? ""
    const aboutText =
        bioText ||
        "No bio has been added yet."
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">About</h3>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <p className="text-muted-foreground text-sm text-justify">
                {aboutText}
            </p>
        </div>
        {open &&
            <EditAboutModal open={open} onOpenChange={setOpen}
                defaultVal={bioText}
            />}

    </>
    )
}

export default AboutSection
