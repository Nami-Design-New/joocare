"use client";

import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { InputField } from '@/shared/components/InputField'
import { Button } from '@/shared/components/ui/button'
import { usePathname } from 'next/navigation';
import { ForgetPasswordSchema, TForgetPasswordSchema } from '@/features/auth/validation/forget-password-schema';
import { OTPModal } from '@/features/auth/components/forget-password/OtpModal';
import { useSession } from 'next-auth/react';
import { useUpdateEmail } from '../hooks/useUpdateEmail';

interface IFormUpdateEmailProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    email?: string,
    btnLabel: string
    setUserEmail: (email: string) => void
    setIsModalOtpOpen: (x: boolean) => void

}

const FormUpdateEmail = ({ open, onOpenChange, btnLabel, email, setUserEmail, setIsModalOtpOpen }: IFormUpdateEmailProps) => {
    const pathname = usePathname();
    const employerForgetPassword = pathname.includes("candidate")
    const basicInfo = pathname.includes("basic-info")
    const { data: session } = useSession();
    const token = session?.accessToken ?? "";
    const { mutate: updateEmail, isPending } = useUpdateEmail({ token });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TForgetPasswordSchema>({
        resolver: zodResolver(ForgetPasswordSchema),
    });

    const onSubmit: SubmitHandler<TForgetPasswordSchema> = (data) => {
        console.log(data);
        setUserEmail(data.email);
        updateEmail({ email: data.email });
        reset()
        setIsModalOtpOpen(true)
        onOpenChange(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <InputField defaultValue={email ? email : ""} label={employerForgetPassword || basicInfo ? 'Official Email' : 'Email'} id="email" type={"email"} error={errors.email?.message} {...register('email')} placeholder="ex:mail@mail.com" />
            <Button variant={"secondary"} size={'pill'} className='w-full' type="submit">
                {btnLabel}
            </Button>

        </form>
    )
}

export default FormUpdateEmail
