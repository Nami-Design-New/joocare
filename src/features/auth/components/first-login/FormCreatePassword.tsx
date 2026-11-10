'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import { InputField } from '@/shared/components/InputField';
import PasswordRequirements from '@/shared/components/PasswordRequirements';
import { Button } from '@/shared/components/ui/button';
import {
  createNewPasswordSchema,
  TNewPasswordSchema,
} from '../../validation/new-password-schema';

export default function FormCreatePassword() {
  const t = useTranslations();
  const router = useRouter();
  const schema = useMemo(
    () =>
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
    [t],
  );
  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<TNewPasswordSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  });
  const newPassword = useWatch({ control, name: 'newPassword' });
  const confirmNewPassword = useWatch({ control, name: 'confirmNewPassword' });

  const onSubmit = handleSubmit(() => {
    router.push('/hiring-manager/shared-projects/emergency-hiring');
  });

  useEffect(() => {
    if (confirmNewPassword) void trigger('confirmNewPassword');
  }, [confirmNewPassword, newPassword, trigger]);

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <InputField
        id="first-login-new-password"
        containerStyles="[&_label]:leading-5"
        type="password"
        label={t('authPage.common.new-password')}
        placeholder={t('authPage.pages.create-password.password-placeholder')}
        autoComplete="new-password"
        aria-describedby="first-login-password-rules"
        hidePasswordErrorMessage
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <InputField
        id="first-login-confirm-password"
        containerStyles="[&_label]:leading-5"
        type="password"
        label={t('authPage.common.confirm-new-password')}
        placeholder={t('authPage.pages.create-password.password-placeholder')}
        autoComplete="new-password"
        error={errors.confirmNewPassword?.message}
        {...register('confirmNewPassword')}
      />
      <PasswordRequirements
        id="first-login-password-rules"
        value={newPassword}
        hasError={!!errors.newPassword}
        className="mt-0 leading-[18px]"
      />
      <Button type="submit" size="pill" className="h-12.5 w-full font-semibold">
        {t('authPage.pages.create-password.continue')}
      </Button>
    </form>
  );
}
