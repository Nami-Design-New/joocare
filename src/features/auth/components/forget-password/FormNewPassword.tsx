"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  NewPasswordSchema,
  TNewPasswordSchema,
} from "../../validation/new-password-schema";
import { PasswordResetRole, resetPassword } from "../../lib/password-reset";
import { useRouter } from "@/i18n/navigation";
import {
  clearPasswordResetContext,
  getPasswordResetContext,
} from "../../lib/password-reset-context";

const FormNewPassword = () => {
    const locale = useLocale();
    const router = useRouter();
    const [resetContext] = useState<{
        email: string;
        otp: string;
        role: PasswordResetRole;
    } | null>(() =>
        typeof document === "undefined" ? null : getPasswordResetContext(),
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TNewPasswordSchema>({
        resolver: zodResolver(NewPasswordSchema),
    });

    const onSubmit: SubmitHandler<TNewPasswordSchema> = async (data) => {
        if (!resetContext?.email || !resetContext.otp || !resetContext.role) {
            toast.error("Reset password session is missing. Please start again.");
            return;
        }

        try {
            const message = await resetPassword({
                role: resetContext.role,
                email: resetContext.email,
                otp: resetContext.otp,
                password: data.newPassword,
                passwordConfirmation: data.confirmNewPassword,
                locale,
            });

            toast.success(message);
            clearPasswordResetContext();
            reset();
            router.push(
                resetContext.role === "employer"
                    ? "/auth/employer/login"
                    : "/auth/candidate/login",
            );
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to reset password.",
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <InputField label='new password' id="newPassword" type={"password"} error={errors.newPassword?.message} {...register('newPassword')} placeholder="*******" />
            <InputField label='Confirm new password' id="confirmNewPassword" type={"password"} error={errors.confirmNewPassword?.message} {...register('confirmNewPassword')} placeholder="*******" />
            <Button variant={"secondary"} size={'pill'} className='w-full' type="submit" disabled={isSubmitting || !resetContext}>
                {isSubmitting ? "Sending..." : "Send"}
            </Button>

            {/* Otp modal  */}
        </form>
    )
}

export default FormNewPassword
