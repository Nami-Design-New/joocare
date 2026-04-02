'use client';

import DeleteModal from "@/shared/components/modals/DeleteModal";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExperienceModal } from "./ExperienceModal";

export default function ExperienceActions() {
    const [open, setOpen] = useState(false)
    const [deleteExperience, setDeleteExperience] = useState(false);
    const handleDeleteExperience = () => {
        setDeleteExperience(false);
    };
    return (<>
        <div className="flex items-center gap-4">
            <Edit width={20} height={20} className="cursor-pointer text-muted-foreground" onClick={() => setOpen(!open)} />
            <Trash2 width={20} height={20} className="cursor-pointer text-red-400" onClick={() => setDeleteExperience(true)} />
        </div>

        <ExperienceModal label="Edit Experience" open={open} onOpenChange={setOpen} />
        <DeleteModal
            open={deleteExperience}
            onOpenChange={setDeleteExperience}
            title="Do you want to delete this Experience?"
            description="The Experience will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
            cancelLabel="Back"
            onConfirm={handleDeleteExperience}
        />
    </>
    );
}
