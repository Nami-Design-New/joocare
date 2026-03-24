"use client"
import { EditAboutModal } from "@/features/company-profile/components/EditAboutModal"
import { Edit2 } from "lucide-react"
import { useState } from "react"

const AboutSection = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">About</h3>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <p className="text-muted-foreground text-sm text-justify">
                Board-certified cardiologist with extensive experience in interventional procedures, cardiac imaging, and preventive cardiology. Passionate about patient-centered care and advancing cardiovascular health through innovative treatments.
            </p>
        </div>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={`Board-certified cardiologist with extensive experience in interventional procedures, cardiac imaging, and preventive cardiology. Passionate about patient-centered care and advancing cardiovascular health through innovative treatments.`}
        />

    </>
    )
}

export default AboutSection
