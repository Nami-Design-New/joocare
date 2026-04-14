"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEffect, useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  PasswordOtpSchema,
  TPasswordOtpSchema,
} from "../../validation/password-otp-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "@/i18n/navigation";
import { requestNotificationPermission } from "@/shared/hooks/requestNotificationPermission";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  PasswordResetRole,
  requestPasswordReset,
  verifyPasswordResetOtp,
} from "../../lib/password-reset";
import { setPasswordResetContext } from "../../lib/password-reset-context";
import {
  confirmEmailVerification,
  requestEmailVerification,
} from "../../lib/email-verification";
import { signIn } from "next-auth/react";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  role?: PasswordResetRole;
  purpose?: "password-reset" | "email-confirm" | "generic";
  successRedirectPath?: string;
  onSuccess?: () => void | Promise<void>;
}

export function OTPModal({
  open,
  onOpenChange,
  email,
  role,
  purpose = "generic",
  successRedirectPath,
  onSuccess,
}: OTPModalProps) {
  const [countdown, setCountdown] = useState(48);
  const router = useRouter();
  const path = usePathname();
  const locale = useLocale();
  const forgetPasswordPage = path.includes("forget-password");
  const registerCandidatePage = path.includes("auth/candidate/register")
  const registerEmployerPage = path.includes("auth/employer/register");
  const basicInfo = path.includes("basic-info");

  const handleGenericSuccess = async () => {
    if (onSuccess) {
      await onSuccess();
      return;
    }

    if (successRedirectPath) {
      router.push(successRedirectPath);
      return;
    }

    if (forgetPasswordPage) {
      router.push("/auth/new-password");
    } else if (basicInfo) {
      onOpenChange(false);
    } else if (registerEmployerPage) {
      router.push('/for-employers')
    } else if (registerCandidatePage) {
      router.push('/')
    } else {
      router.push("/");
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TPasswordOtpSchema>({
    resolver: zodResolver(PasswordOtpSchema),
  });

  const onSubmit: SubmitHandler<TPasswordOtpSchema> = async (data) => {
    try {
      if (purpose === "password-reset" && email && role) {
        const message = await verifyPasswordResetOtp({
          role,
          email,
          otp: data.otp,
          locale,
        });

        toast.success(message);
        reset();
        onOpenChange(false);
        setPasswordResetContext({
          email,
          otp: data.otp,
          role,
        });
        router.push("/auth/new-password");
        return;
      }

      if (purpose === "email-confirm" && email && role) {
        const { data: otpData } = await confirmEmailVerification({
          role,
          email,
          otp: data.otp,
          locale,
        });

        const accessToken = otpData?.data?.token
        const user = otpData?.data?.company || otpData?.data?.user;

        const providerByRole: Record<string, string> = {
          candidate: "candidate-credentials",
          employer: "employer-credentials",
        };

        // login after register
        if (accessToken && role) {
          await signIn(providerByRole[role], {
            redirect: false,
            accessToken,
            user: JSON.stringify(user),
          });
          void requestNotificationPermission();
        }

        // toast.success(message);
        reset();
        onOpenChange(false);
        await handleGenericSuccess();
        return;
      }

      reset();
      await handleGenericSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid verification code.",
      );
    }
  };

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

  const handleResend = async () => {
    try {
      if (purpose === "password-reset" && email && role) {
        const message = await requestPasswordReset({
          role,
          email,
          locale,
        });

        toast.success(message);
      }

      if (purpose === "email-confirm" && email && role) {
        const message = await requestEmailVerification({
          role,
          email,
          locale,
        });

        toast.success(message);
      }

      setCountdown(48);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend code.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 pt-14 sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-secondary text-[28px] font-semibold">
            Email Verification
          </DialogTitle>
          <DialogDescription className="text-center md:px-4">
            Enter the code sent to{" "}
            <span className="text-secondary font-bold">{email}</span>, or click
            the link in the email.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-3"
        >
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
                <InputOTPGroup className="flex w-full justify-between gap-[clamp(0.25rem,2vw,0.5rem)]">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="text-secondary bg-input focus:ring-primary h-[clamp(3rem,16vw,6.5rem)] w-[clamp(2.5rem,14vw,5.25rem)] rounded-md border border-gray-300 text-[clamp(1rem,4vw,3rem)] font-bold transition-all focus:ring-2 focus:outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {errors.otp && (
            <p className="self-start text-sm text-red-500">
              {errors.otp.message}
            </p>
          )}

          <div className="flex w-full justify-between text-sm">
            <button
              type="button"
              disabled={countdown > 0}
              onClick={handleResend}
              className="text-secondary cursor-pointer disabled:opacity-50"
            >
              Resend the code
            </button>
            <span>{`00:${countdown.toString().padStart(2, "0")}`}</span>
          </div>

          <Button
            type="submit"
            variant={"secondary"}
            size={"pill"}
            className="mt-4 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
