"use client"

import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { EducationModal } from './EducationModal'
import DeleteModal from '@/shared/components/modals/DeleteModal'


const OneEducationSection = () => {
    const [open, setOpen] = useState(false)
    const [deleteEducation, setDeleteEducation] = useState(false);
    const handleDeleteEducation = () => {
        setDeleteEducation(false);
    };
    return (<>
        <div className="flex justify-between items-start gap-2">
            <div className="flex justify-start items-start gap-2">
                <div className="bg-accent rounded-full p-2">
                    <Image src={'/assets/building-office-2.svg'} alt="building image" width={24} height={24} />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Tanta University</h3>
                    <p className="text-sm font-normal text-muted-foreground">Bachelor&apos;s degree, Medicine and Surgery</p>
                    <span className="text-sm font-normal text-muted-foreground">2017 - 2021</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Edit width={20} height={20} className="cursor-pointer text-muted-foreground" onClick={() => setOpen(!open)} />
                <Trash2 width={20} height={20} className="cursor-pointer text-red-400" onClick={() => setDeleteEducation(true)} />
            </div>
        </div>
        <EducationModal label="Edit Education" open={open} onOpenChange={setOpen} />
        <DeleteModal
            open={deleteEducation}
            onOpenChange={setDeleteEducation}
            title="Do you want to delete this Education?"
            description="The Education will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
            cancelLabel="Back"
            onConfirm={handleDeleteEducation}
        />
    </>
    )
}

export default OneEducationSection
