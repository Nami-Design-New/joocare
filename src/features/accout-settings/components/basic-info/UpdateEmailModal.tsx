"use client";

import FormUpdateEmail from "@/features/accout-settings/components/FormUpdateEmail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 pt-14 sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-secondary text-[28px] font-semibold">
            Enter the new email
          </DialogTitle>
          <DialogDescription className="text-center md:px-4">
            A verification code will be sent to the new email address
          </DialogDescription>
        </DialogHeader>

        <FormUpdateEmail
          setUserEmail={setUserEmail}
          open={open}
          onOpenChange={onOpenChange}
          email={email}
          btnLabel="Send Verification"
          setIsModalOtpOpen={setIsModalOtpOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
