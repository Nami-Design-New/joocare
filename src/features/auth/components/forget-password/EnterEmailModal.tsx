"use client"

import FormUpdateEmail from "@/features/accout-settings/components/FormUpdateEmail"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog"

interface EnterEmailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    setIsModalOtpOpen: (x: boolean) => void
    email?: string
    setUserEmail: React.Dispatch<React.SetStateAction<string>>
}

export function EnterEmailModal({ open, onOpenChange, email, setUserEmail, setIsModalOtpOpen }: EnterEmailModalProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full p-6 pt-14">
                <DialogHeader className="flex items-center">
                    <DialogTitle className="text-secondary font-semibold text-[28px]">Enter the new email</DialogTitle>
                    <DialogDescription className="text-center md:px-4">
                        A verification code will be sent to the new email address
                    </DialogDescription>
                </DialogHeader>
                {/* form  */}
                <FormUpdateEmail setUserEmail={setUserEmail} open={open} onOpenChange={onOpenChange} email={email} btnLabel='Send Verification'
                    setIsModalOtpOpen={setIsModalOtpOpen} />
            </DialogContent>
        </Dialog>
    )
}