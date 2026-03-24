"use client"
import { EditAboutModal } from "@/features/company-profile/components/EditAboutModal"
import { Plus } from "lucide-react"
import { useState } from "react"
import OneEducationSection from "./OneEducationSection"

const EducationSection = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <section className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">Education</h3>
                <Plus size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>

            <OneEducationSection />

        </section>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={`Board-certified cardiologist with extensive experience in interventional procedures, cardiac imaging, and preventive cardiology. Passionate about patient-centered care and advancing cardiovascular health through innovative treatments.`}
        />

    </>
    )
}

export default EducationSection
