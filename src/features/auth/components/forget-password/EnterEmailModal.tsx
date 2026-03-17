"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog"
import FormForgetPassword from "./FormForgetPassword"

interface EnterEmailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EnterEmailModal({ open, onOpenChange }: EnterEmailModalProps) {

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
                <FormForgetPassword btnLabel='Send Verification' />
            </DialogContent>
        </Dialog>
    )
}