import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChangePasswordPayload } from '../types';
import { changePasswordService } from '../services/change-password-service';
import { useTranslations } from 'next-intl';

export const useChangePassword = ({ token }: { token: string }) => {
  const t = useTranslations('common.password-validation');
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePasswordService(payload, { token }),
    onError: (error: Error) => {
      toast.error(error.message || t('change-failed'));
    },
  });
};
