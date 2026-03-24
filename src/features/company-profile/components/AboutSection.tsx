"use client"
import { Edit2 } from "lucide-react"
import { EditAboutModal } from "./EditAboutModal"
import { useState } from "react"

const AboutSection = () => {
    const [open, setOpen] = useState(false)
    return (<>
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">About</h2>
                <Edit2 size={22} className="cursor-pointer" onClick={() => setOpen(!open)} />
            </div>
            <p className="text-muted-foreground text-sm text-justify">Saudi German Hospitals is the leading healthcare provider and the number one healthcare brand in the MENA region. Saudi German Hospital – Egypt is part of the renowned SGH Group, founded in 1988 by the El Batterji family. Today, the group operates 14 hospitals across 4 countries: Egypt, Saudi Arabia, the UAE,  and Yemen. As a tertiary care hospital, SGH–Egypt aspires to be a premier healthcare destination and an employer of choice, attracting top medical talent from across the region, the hospital is committed to establishing itself as one of Egypt’s leading tertiary care institutions SGH–Egypt will provide a comprehensive range of medical services, covering all specialties, sub-specialties, and critical care units, all delivered in line with the highest international healthcare standards.</p>
        </div>
        <EditAboutModal open={open} onOpenChange={setOpen}
            defaultVal={`Saudi German Hospitals is the leading healthcare provider and the number one healthcare brand in the MENA region. Saudi German Hospital – Egypt is part of the renowned SGH Group, founded in 1988 by the El Batterji family. Today, the group operates 14 hospitals across 4 countries: Egypt, Saudi Arabia, the UAE, and Yemen. As a tertiary care hospital, SGH–Egypt aspires to be a premier healthcare destination and an employer of choice, attracting top medical talent from across the region, the hospital is committed to establishing itself as one of Egypt’s leading tertiary care institutions SGH–Egypt will provide a comprehensive range of medical services, covering all specialties, sub-specialties, and critical care units, all delivered in line with the highest international healthcare standards.`}
        />
    </>
    )
}

export default AboutSection
