'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { InputField } from '@/shared/components/InputField';
import PasswordRequirements from '@/shared/components/PasswordRequirements';
import PasswordChangedModal from '@/shared/components/modals/PasswordChangedModal';
import { Button } from '@/shared/components/ui/button';
import {
  createNewPasswordSchema,
  TNewPasswordSchema,
} from '../../validation/new-password-schema';
import { PasswordResetRole, resetPassword } from '../../lib/password-reset';
import { useRouter } from '@/i18n/navigation';
import {
  clearPasswordResetContext,
  getPasswordResetContext,
} from '../../lib/password-reset-context';

const FormNewPassword = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);
  const [resetContext] = useState<{
    email: string;
    otp: string;
    role: PasswordResetRole;
  } | null>(() =>
    typeof document === 'undefined' ? null : getPasswordResetContext(),
  );

  const {
    register,
    control,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TNewPasswordSchema>({
    resolver: zodResolver(
      createNewPasswordSchema({
        passwordRequired: t('authPage.validation.password-required'),
        passwordMin: t('common.password-validation.minimum-error'),
        passwordMax: t('authPage.validation.password-max'),
        passwordRules: t('common.password-validation.invalid'),
        confirmPasswordRequired: t(
          'authPage.validation.confirm-password-required',
        ),
        passwordsDoNotMatch: t('authPage.validation.passwords-do-not-match'),
      }),
    ),
    mode: 'onChange',
  });
  const newPassword = useWatch({ control, name: 'newPassword' });
  const confirmNewPassword = useWatch({ control, name: 'confirmNewPassword' });

  useEffect(() => {
    if (confirmNewPassword) void trigger('confirmNewPassword');
  }, [confirmNewPassword, newPassword, trigger]);

  const handleSuccessOpenChange = useCallback(
    (open: boolean) => {
      setSuccessOpen(open);
      if (!open)
        router.push(
          resetContext?.role === 'employer'
            ? '/auth/employer/login'
            : '/auth/candidate/login',
        );
    },
    [router, resetContext?.role],
  );

  const onSubmit: SubmitHandler<TNewPasswordSchema> = async (data) => {
    if (!resetContext?.email || !resetContext.otp || !resetContext.role) {
      toast.error(t('authPage.toasts.reset-session-missing'));
      return;
    }

    try {
      await resetPassword({
        role: resetContext.role,
        email: resetContext.email,
        otp: resetContext.otp,
        password: data.newPassword,
        passwordConfirmation: data.confirmNewPassword,
        locale,
      });

      clearPasswordResetContext();
      reset();
      setSuccessOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('authPage.toasts.failed-reset-password'),
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <InputField
          label={t('authPage.common.new-password')}
          id="newPassword"
          type={'password'}
          hidePasswordErrorMessage
          aria-describedby="newPassword-password-rules"
          error={errors.newPassword?.message}
          {...register('newPassword')}
          autoComplete="new-password"
          placeholder="*******"
        />
        <InputField
          label={t('authPage.common.confirm-new-password')}
          id="confirmNewPassword"
          type={'password'}
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
          autoComplete="new-password"
          placeholder="*******"
        />
        <PasswordRequirements
          id="newPassword-password-rules"
          value={newPassword ?? ''}
          hasError={!!errors.newPassword}
        />
        <Button
          variant={'secondary'}
          size={'pill'}
          className="w-full"
          type="submit"
          disabled={isSubmitting || !resetContext || successOpen}
        >
          {isSubmitting
            ? t('authPage.common.sending')
            : t('authPage.common.send')}
        </Button>
      </form>
      <PasswordChangedModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
      />
    </>
  );
};

export default FormNewPassword;
