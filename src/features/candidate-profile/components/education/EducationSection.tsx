"use client"
import { Plus } from "lucide-react"
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
    const educations = profile?.educations ?? []
    return (<>
        <section className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">Education</h3>
                <Plus size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>

            {educations.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {educations.map((education) => (
                        <OneEducationSection key={education.id} education={education} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No education added yet.</p>
            )}

        </section>
        {open && <EducationModal label="Add Education" open={open} onOpenChange={setOpen} education={null}
        />}

    </>
    )
}

export default EducationSection
