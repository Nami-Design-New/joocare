"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { createChangePasswordSchema, TChangePasswordSchema } from '../../validation/change-password-schema';
import { useSession } from 'next-auth/react';
import { useChangePassword } from '../../hooks/useChangePassword';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const ChangePasswordForm = () => {
    const t = useTranslations();
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const { mutate: changePassword, isPending } = useChangePassword({ token });

    const schema = useMemo(() => createChangePasswordSchema({
        messages: {
            currentPasswordRequired: t("companyPage.accountSettings.validation.current-password-required"),
            newPasswordRequired: t("companyPage.accountSettings.validation.new-password-required"),
            newPasswordMin: t("companyPage.accountSettings.validation.new-password-min"),
            newPasswordMax: t("companyPage.accountSettings.validation.new-password-max"),
            confirmNewPasswordRequired: t("companyPage.accountSettings.validation.confirm-new-password-required"),
            passwordsDoNotMatch: t("companyPage.accountSettings.validation.passwords-do-not-match"),
        },
    }), [t]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TChangePasswordSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<TChangePasswordSchema> = (data) => {
        changePassword({
            current_password: data.currentPassword,
            password: data.newPassword,
            password_confirmation: data.confirmNewPassword,
        });
        // reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center justify-center">
            <InputField label={t("companyPage.accountSettings.changePassword.fields.current-password.label")} id="currentPassword" type={"password"}
                error={errors.currentPassword?.message} {...register('currentPassword')}
                placeholder={t("companyPage.accountSettings.changePassword.fields.password.placeholder")} />

            <InputField label={t("companyPage.accountSettings.changePassword.fields.new-password.label")} id="newPassword" type={"password"}
                error={errors.newPassword?.message} {...register('newPassword')}
                placeholder={t("companyPage.accountSettings.changePassword.fields.password.placeholder")} />

            <InputField label={t("companyPage.accountSettings.changePassword.fields.confirm-new-password.label")} id="confirmNewPassword"
                type={"password"}
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}


                placeholder={t("companyPage.accountSettings.changePassword.fields.password.placeholder")} />
            <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit">
                {isPending ? t("common.saving") : t("common.save")}
            </Button>

        </form>
    )
}

export default ChangePasswordForm
