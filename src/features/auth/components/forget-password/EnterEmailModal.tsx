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

interface EnterEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsModalOtpOpen: (x: boolean) => void;
  email?: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

export function EnterEmailModal({
  open,
  onOpenChange,
  email,
  setUserEmail,
  setIsModalOtpOpen,
}: EnterEmailModalProps) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 pt-14 sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-[28px] font-semibold text-secondary">
            {t('companyPage.accountSettings.updateEmail.title')}
          </DialogTitle>
          <DialogDescription className="text-center md:px-4">
            {t('companyPage.accountSettings.updateEmail.description')}
          </DialogDescription>
        </DialogHeader>
        {/* form  */}
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
