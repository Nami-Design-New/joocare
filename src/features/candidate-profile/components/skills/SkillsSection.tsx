"use client"
import { EditAboutModal } from "@/features/company-profile/components/EditAboutModal"
import { Edit2, Plus } from "lucide-react"
import { useState } from "react"
import OneSkillSection from "./OneSkillSection"

const SkillsSection = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <section className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">Skills</h3>
                <div className="flex items-center gap-4">
                    <Plus size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
                    <Edit2 size={22} className="cursor-pointer" />
                </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
                <OneSkillSection label="Clinical diagnosis" />
                <OneSkillSection label="Medical " />
                <OneSkillSection label="Emergency" />
                <OneSkillSection label="Effective patient" />
                <OneSkillSection label="Empathy" />
                <OneSkillSection label="Emergency" />
                <OneSkillSection label="Emergency" />

            </div>

        </section>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={`Board-certified cardiologist with extensive experience in interventional procedures, cardiac imaging, and preventive cardiology. Passionate about patient-centered care and advancing cardiovascular health through innovative treatments.`}
        />

    </>
    )
}

export default SkillsSection
