"use client"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { EducationModal } from "./EducationModal"
import OneEducationSection from "./OneEducationSection"
import type { CandidateProfileViewModel } from "../../types/profile.types"

const EducationSection = ({
    profile,
}: {
    profile: CandidateProfileViewModel | null
}) => {
    const [open, setOpen] = useState(false)
    const t = useTranslations("Candidate")
    const educations = profile?.educations ?? []
    return (<>
        <section className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">{t("education")}</h3>
                <Plus size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>

            {educations.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {educations.map((education) => (
                        <OneEducationSection key={education.id} education={education} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{t("noEducationYet")}</p>
            )}

        </section>
        {open && <EducationModal label={t("addEducation")} open={open} onOpenChange={setOpen} education={null}
        />}

    </>
    )
}

export default EducationSection
