'use client';

import FormUpdateEmail from '@/features/accout-settings/components/FormUpdateEmail';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useTranslations } from 'next-intl';

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
      <DialogContent className="w-[calc(100%-2rem)] p-5 pt-10 sm:w-full sm:max-w-md sm:p-6 sm:pt-14">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-2xl font-semibold text-secondary sm:text-[28px]">
            {t('companyPage.accountSettings.updateEmail.title')}
          </DialogTitle>
          <DialogDescription className="text-center md:px-4">
            {t('companyPage.accountSettings.updateEmail.description')}
          </DialogDescription>
        </DialogHeader>

        <FormUpdateEmail
          setUserEmail={setUserEmail}
          open={open}
          onOpenChange={onOpenChange}
          email={email}
          btnLabel={t(
            'companyPage.accountSettings.updateEmail.send-verification',
          )}
          setIsModalOtpOpen={setIsModalOtpOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
