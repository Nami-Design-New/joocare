"use client";

import FormUpdateEmail from "@/features/accout-settings/components/FormUpdateEmail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslations } from "next-intl";

interface UpdateEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsModalOtpOpen: (open: boolean) => void;
  email?: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

export function UpdateEmailModal({
  open,
  onOpenChange,
  email,
  setUserEmail,
  setIsModalOtpOpen,
}: UpdateEmailModalProps) {
  const t = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 pt-14 sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-secondary text-[28px] font-semibold">
            {t("companyPage.accountSettings.updateEmail.title")}
          </DialogTitle>
          <DialogDescription className="text-center md:px-4">
            {t("companyPage.accountSettings.updateEmail.description")}
          </DialogDescription>
        </DialogHeader>

        <FormUpdateEmail
          setUserEmail={setUserEmail}
          open={open}
          onOpenChange={onOpenChange}
          email={email}
          btnLabel={t("companyPage.accountSettings.updateEmail.send-verification")}
          setIsModalOtpOpen={setIsModalOtpOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
