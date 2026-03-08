"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { NewPasswordSchema, TNewPasswordSchema } from '../../validation/new-password-schema';

const FormNewPassword = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TNewPasswordSchema>({
        resolver: zodResolver(NewPasswordSchema),
    });

    const onSubmit: SubmitHandler<TNewPasswordSchema> = (data) => {
        console.log(data);
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <InputField label='new password' id="newPassword" type={"password"} error={errors.newPassword?.message} {...register('newPassword')} placeholder="*******" />
            <InputField label='Confirm new password' id="confirmNewPassword" type={"password"} error={errors.confirmNewPassword?.message} {...register('confirmNewPassword')} placeholder="*******" />
            <Button variant={"secondary"} size={'pill'} className='w-full' type="submit">
                Send
            </Button>

            {/* Otp modal  */}
        </form>
    )
}

export default FormNewPassword
