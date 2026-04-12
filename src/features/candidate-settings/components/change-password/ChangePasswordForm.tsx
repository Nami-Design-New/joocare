"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { ChangePasswordSchema, TChangePasswordSchema } from '../../validation/change-password-schema';
import { useChangePassword } from '../../hooks/useChangePassword';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const ChangePasswordForm = () => {
    const t = useTranslations("CandidateChangePassword");
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const { mutate: changePassword, isPending } = useChangePassword({ token });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TChangePasswordSchema>({
        resolver: zodResolver(ChangePasswordSchema),
    });

    const onSubmit: SubmitHandler<TChangePasswordSchema> = (data) => {
        changePassword({
            current_password: data.currentPassword,
            password: data.newPassword,
            password_confirmation: data.confirmNewPassword,
        });
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center justify-center">
            <InputField label={t("currentPassword")} id="currentPassword" type={"password"}
                error={errors.currentPassword?.message} {...register('currentPassword')}
                placeholder={t("passwordPlaceholder")} />

            <InputField label={t("newPassword")} id="newPassword" type={"password"}
                error={errors.newPassword?.message} {...register('newPassword')}
                placeholder={t("passwordPlaceholder")} />

            <InputField label={t("confirmNewPassword")} id="confirmNewPassword"
                type={"password"}
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}


                placeholder={t("passwordPlaceholder")} />
            <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit" disabled={isPending}>
                {isPending ? t("saving") : t("save")}
            </Button>

        </form>
    )
}

export default ChangePasswordForm
