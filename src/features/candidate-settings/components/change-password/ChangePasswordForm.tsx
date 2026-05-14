"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { createChangePasswordSchema, TChangePasswordSchema } from '../../validation/change-password-schema';
import { useChangePassword } from '../../hooks/useChangePassword';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from "react";

const ChangePasswordForm = () => {
    const t = useTranslations();
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const { mutate: changePassword, isPending } = useChangePassword({ token });
    const schema = useMemo(
        () =>
            createChangePasswordSchema({
                currentPasswordRequired: t("candidateValidation.current-password-required"),
                newPasswordRequired: t("authPage.validation.password-required"),
                newPasswordMin: t("authPage.validation.password-min"),
                newPasswordMax: t("authPage.validation.password-max"),
                confirmPasswordRequired: t("authPage.validation.confirm-password-required"),
                passwordsMismatch: t("authPage.validation.passwords-do-not-match"),
            }),
        [t],
    );

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
            <InputField label={t("candidatePage.settings.current-password")} id="currentPassword" type={"password"}
                error={errors.currentPassword?.message} {...register('currentPassword')}
                placeholder="*******" />

            <InputField label={t("candidatePage.settings.new-password")} id="newPassword" type={"password"}
                error={errors.newPassword?.message} {...register('newPassword')}
                placeholder="*******" />

            <InputField label={t("candidatePage.settings.confirm-new-password")} id="confirmNewPassword"
                type={"password"}
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}


                placeholder="*******" />
            <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit" disabled={isPending}>
                {isPending ? t("candidatePage.common.saving") : t("common.save")}
            </Button>

        </form>
    )
}

export default ChangePasswordForm
