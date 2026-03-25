"use client"
import { Plus } from "lucide-react"
import { useState } from "react"
import { EducationModal } from "./EducationModal"
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
        <EducationModal label="Add Education" open={open} onOpenChange={setOpen}
        />

    </>
    )
}

export default EducationSection
