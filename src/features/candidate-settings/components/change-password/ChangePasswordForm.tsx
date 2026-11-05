'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

import { InputField } from '@/shared/components/InputField';
import PasswordRequirements from '@/shared/components/PasswordRequirements';
import { Button } from '@/shared/components/ui/button';
import {
  createChangePasswordSchema,
  TChangePasswordSchema,
} from '../../validation/change-password-schema';
import { useChangePassword } from '../../hooks/useChangePassword';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import PasswordChangedModal from '@/shared/components/modals/PasswordChangedModal';

const ChangePasswordForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);
  const handleSuccessOpenChange = useCallback(
    (open: boolean) => {
      setSuccessOpen(open);
      if (!open) router.push('/candidate/profile');
    },
    [router],
  );
  const { data: session } = useSession();
  const token = session?.accessToken || '';
  const { mutate: changePassword, isPending } = useChangePassword({ token });
  const schema = useMemo(
    () =>
      createChangePasswordSchema({
        currentPasswordRequired: t(
          'candidateValidation.current-password-required',
        ),
        newPasswordRequired: t('authPage.validation.password-required'),
        newPasswordMin: t('common.password-validation.minimum-error'),
        newPasswordMax: t('authPage.validation.password-max'),
        passwordRules: t('common.password-validation.invalid'),
        newPasswordSameAsCurrent: t(
          'common.password-validation.same-as-previous',
        ),
        confirmPasswordRequired: t(
          'authPage.validation.confirm-password-required',
        ),
        passwordsMismatch: t('authPage.validation.passwords-do-not-match'),
      }),
    [t],
  );

  const {
    register,
    control,
    trigger,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TChangePasswordSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const currentPassword = useWatch({ control, name: 'currentPassword' });
  const newPassword = useWatch({ control, name: 'newPassword' });
  const confirmNewPassword = useWatch({ control, name: 'confirmNewPassword' });

  useEffect(() => {
    if (confirmNewPassword) void trigger('confirmNewPassword');
  }, [confirmNewPassword, newPassword, trigger]);

  useEffect(() => {
    if (getValues('newPassword')) void trigger('newPassword');
  }, [currentPassword, getValues, trigger]);

  const onSubmit: SubmitHandler<TChangePasswordSchema> = (data) => {
    changePassword(
      {
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmNewPassword,
      },
      {
        onSuccess: () => {
          reset();
          setSuccessOpen(true);
        },
      },
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-5"
      >
        <InputField
          label={t('candidatePage.settings.current-password')}
          id="currentPassword"
          type={'password'}
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
          autoComplete="current-password"
          placeholder="*******"
        />

        <InputField
          label={t('candidatePage.settings.new-password')}
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
          label={t('candidatePage.settings.confirm-new-password')}
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
          showPreviousPasswordRule
          previousPassword={currentPassword ?? ''}
        />
        <Button
          variant={'secondary'}
          hoverStyle={'slidePrimary'}
          size={'pill'}
          className="w-1/3 md:w-56"
          type="submit"
          disabled={isPending || successOpen}
        >
          {isPending ? t('candidatePage.common.saving') : t('common.save')}
        </Button>
      </form>
      <PasswordChangedModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
      />
    </>
  );
};

export default ChangePasswordForm;
