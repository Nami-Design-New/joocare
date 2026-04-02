"use client"

import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

// ─── Constants ───────────────────────────────────────────────────────────────





interface EditSkillsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    skills: string[]
    onSave: (skills: string[]) => void
}





// ─── EditSkillsModal ──────────────────────────────────────────────────────────

export function EditSkillsModal({ open, onOpenChange, skills, onSave }: EditSkillsModalProps) {
    const [current, setCurrent] = useState<string[]>(skills)

    // Sync when modal opens with new skills
    useEffect(() => {
        if (open) setCurrent(skills)
    }, [open, skills])

    const remove = (skill: string) => {
        setCurrent((prev) => prev.filter((s) => s !== skill))
    }

    const handleSave = () => {
        onSave(current)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl gap-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Edit Skills</DialogTitle>
                </DialogHeader>

                {current.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No skills added yet.</p>
                ) : (
                    <div className="bg-[#09760A08] rounded-xl p-3 flex flex-wrap gap-2 min-h-[60px]">
                        {current.map((skill) => (
                            <span
                                key={skill}
                                className="flex items-center gap-1.5 bg-primary text-white text-sm px-3 py-1 rounded-full"
                            >
                                {skill}
                                <X
                                    size={13}
                                    className="cursor-pointer hover:opacity-70"
                                    onClick={() => remove(skill)}
                                />
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="flex justify-center pt-1">
                    <Button onClick={handleSave} className="rounded-full px-10">
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}