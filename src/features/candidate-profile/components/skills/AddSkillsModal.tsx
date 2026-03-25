"use client"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { useState } from "react"
import { MultiSelectInputSkills } from "./MultiSelectInputSkills"

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_SKILLS = [
    "Anesthesiology",
    "Rheumatology",
    "Oncology",
    "Ophthalmology",
    "Endocrinology",
    "Emergency Medicine",
    "Psychiatry",
    "Urology",
    "Pediatrics",
    "Infectious Diseases",
    "Orthopedics",
    "Hematology",
    "Dermatology",
    "Pulmonology",
    "Radiology",
    "Nephrology",
    "Gastroenterology",
    "Obstetrics and Gynecology",
    "Neurology",
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddSkillsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (skills: string[]) => void
}


// ─── AddSkillsModal ───────────────────────────────────────────────────────────

export function AddSkillsModal({ open, onOpenChange, onSave }: AddSkillsModalProps) {
    const [selected, setSelected] = useState<string[]>([])

    const toggle = (skill: string) => {
        setSelected((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        )
    }

    const remove = (skill: string) => {
        setSelected((prev) => prev.filter((s) => s !== skill))
    }

    const handleAdd = () => {
        onSave(selected)
        onOpenChange(false)
    }

    const handleClose = (val: boolean) => {
        if (!val) setSelected([])
        onOpenChange(val)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-150 rounded-2xl gap-4">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-black">Add Skills</DialogTitle>
                </DialogHeader>

                {/* Multi-select input */}
                <div className="space-y-1.5">
                    <label className="font-semibold ">Skill</label>
                    <MultiSelectInputSkills
                        selected={selected}
                        onSelect={toggle}
                        onRemove={remove}
                        options={ALL_SKILLS}
                    />
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                    <p className="text-sm ">Suggested based on your profile</p>
                    <div className="bg-[#09760A05] rounded-xl p-3 flex flex-wrap gap-2">
                        {ALL_SKILLS.map((skill) => {
                            const isSelected = selected.includes(skill)
                            return (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggle(skill)}
                                    className={`px-4 py-2 rounded-full text-sm border border-border transition-all
                                        ${isSelected
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-black border-muted hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {skill}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex justify-center pt-1">
                    <Button
                        onClick={handleAdd}
                        disabled={selected.length === 0}
                        className="rounded-full px-10"
                    >
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
