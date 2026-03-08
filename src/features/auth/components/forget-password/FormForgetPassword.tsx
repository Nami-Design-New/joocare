"use client";

import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { InputField } from '@/shared/components/InputField'
import { Button } from '@/shared/components/ui/button'
import { ForgetPasswordSchema, TForgetPasswordSchema } from '../../validation/forget-password-schema';
import { OTPModal } from './OtpModal';

const FormForgetPassword = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // <-- modal state
    const [userEmail, setUserEmail] = useState('');

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
        reset()
        setIsModalOpen(true)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <InputField label='Email' id="email" type={"email"} error={errors.email?.message} {...register('email')} placeholder="ex:mail@mail.com" />
            <Button variant={"secondary"} size={'pill'} className='w-full' type="submit">
                Send
            </Button>

            {/* Otp modal  */}
            <OTPModal email={userEmail} open={isModalOpen} onOpenChange={setIsModalOpen} />
        </form>
    )
}

export default FormForgetPassword
