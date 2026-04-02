"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { ChangePasswordSchema, TChangePasswordSchema } from '../../validation/change-password-schema';

const ChangePasswordForm = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TChangePasswordSchema>({
        resolver: zodResolver(ChangePasswordSchema),
    });

    const onSubmit: SubmitHandler<TChangePasswordSchema> = (data) => {
        console.log(data);
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center justify-center">
            <InputField label='Current password' id="currentPassword" type={"password"}
                error={errors.currentPassword?.message} {...register('currentPassword')}
                placeholder="*******" />

            <InputField label='New password' id="newPassword" type={"password"}
                error={errors.newPassword?.message} {...register('newPassword')}
                placeholder="*******" />

            <InputField label='Confirm new password' id="confirmNewPassword"
                type={"password"}
                error={errors.confirmNewPassword?.message}
                {...register('confirmNewPassword')}


                placeholder="*******" />
            <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit">
                Save
            </Button>

        </form>
    )
}

export default ChangePasswordForm
