// import { Button } from "@/shared/components/ui/button";
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/shared/components/ui/dialog";
// import { Field, FieldGroup } from "@/shared/components/ui/field";
// import { Input } from "@/shared/components/ui/input";
// import { Label } from "@/shared/components/ui/label";

// interface OtpModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }
// export function OtpModal({ open, onOpenChange }: OtpModalProps) {
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <form>
//                 <DialogContent className="sm:max-w-sm">
//                     <DialogHeader>
//                         <DialogTitle>OTP Verification</DialogTitle>
//                         <DialogDescription>
//                             Enter the OTP sent to your email.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <FieldGroup>
//                         <Field>
//                             <Label htmlFor="otp">OTP</Label>
//                             <Input id="otp" name="otp" placeholder="Enter OTP" />
//                         </Field>
//                     </FieldGroup>
//                     <DialogFooter>
//                         <DialogClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </DialogClose>
//                         <Button type="submit">Verify OTP</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </form>
//         </Dialog>
//     )
// }



"use client"

import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog"
import { useEffect, useState } from "react"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { PasswordOtpSchema, TPasswordOtpSchema } from "../../validation/password-otp-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { usePathname } from "@/i18n/navigation"

interface OTPModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    email?: string
}

export function OTPModal({ open, onOpenChange, email }: OTPModalProps) {
    const [countdown, setCountdown] = useState(48)
    const router = useRouter()
    const path = usePathname()
    const forgetPasswordPage = path.includes('forget-password')
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TPasswordOtpSchema>({
        resolver: zodResolver(PasswordOtpSchema),
    });

    const onSubmit: SubmitHandler<TPasswordOtpSchema> = (data) => {
        console.log({ otp: data.otp, email: email }); // { otp: "12345" }
        reset()
        // onOpenChange(false)
        if (forgetPasswordPage) {
            router.push('/auth/new-password')
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        if (!open) return;
        const timeout = setTimeout(() => setCountdown(48), 0);
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => {
            clearTimeout(timeout);
            clearInterval(timer);
        };
    }, [open]);

    const handleResend = () => {
        console.log("Resend OTP to", email)
        setCountdown(48)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full p-6 pt-14">
                <DialogHeader className="flex items-center">
                    <DialogTitle className="text-secondary font-semibold text-[28px]">Email Verification</DialogTitle>
                    <DialogDescription className="text-center md:px-4">
                        Enter the code sent to <span className="font-bold text-secondary">{email}</span>, or click the link in the email.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3  items-center">
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <InputOTP
                                maxLength={5}
                                pattern={REGEXP_ONLY_DIGITS}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            >
                                <InputOTPGroup className="flex justify-between gap-[clamp(0.25rem,2vw,0.5rem)] w-full">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="w-[clamp(2.5rem,14vw,5.25rem)] h-[clamp(3rem,16vw,6.5rem)] text-[clamp(1rem,4vw,3rem)] font-bold text-secondary bg-input border border-gray-300 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />

                    {errors.otp && (
                        <p className="text-red-500 text-sm self-start">{errors.otp.message}</p>
                    )}

                    <div className="flex justify-between w-full text-sm">
                        <button type="button" disabled={countdown > 0} onClick={handleResend} className="text-secondary cursor-pointer">
                            Resend the code
                        </button>
                        <span>{`00:${countdown.toString().padStart(2, "0")}`}</span>
                    </div>

                    <Button type="submit" variant={"secondary"} size={"pill"} className="w-full mt-4">Confirm</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}