"use client"

import FormUpdateEmail from "@/features/accout-settings/components/FormUpdateEmail"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog"
import { useTranslations } from "next-intl"

interface EnterEmailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    setIsModalOtpOpen: (x: boolean) => void
    email?: string
    setUserEmail: React.Dispatch<React.SetStateAction<string>>
}

export function EnterEmailModal({ open, onOpenChange, email, setUserEmail, setIsModalOtpOpen }: EnterEmailModalProps) {
    const t = useTranslations();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full p-6 pt-14">
                <DialogHeader className="flex items-center">
                    <DialogTitle className="text-secondary font-semibold text-[28px]">{t("companyPage.accountSettings.updateEmail.title")}</DialogTitle>
                    <DialogDescription className="text-center md:px-4">
                        {t("companyPage.accountSettings.updateEmail.description")}
                    </DialogDescription>
                </DialogHeader>
                {/* form  */}
                <FormUpdateEmail setUserEmail={setUserEmail} open={open} onOpenChange={onOpenChange} email={email} btnLabel={t("companyPage.accountSettings.updateEmail.send-verification")}
                    setIsModalOtpOpen={setIsModalOtpOpen} />
            </DialogContent>
        </Dialog>
    )
}
