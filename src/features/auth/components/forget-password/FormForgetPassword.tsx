"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocale } from "next-intl";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  ForgetPasswordSchema,
  TForgetPasswordSchema,
} from "../../validation/forget-password-schema";
import { OTPModal } from "./OtpModal";
import { usePathname } from "next/navigation";
import {
  PasswordResetRole,
  requestPasswordReset,
} from "../../lib/password-reset";

const FormForgetPassword = ({ btnLabel }: { btnLabel: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const pathname = usePathname();
  const locale = useLocale();
  const resetRole: PasswordResetRole = pathname.includes("/employer/")
    ? "employer"
    : "candidate";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForgetPasswordSchema>({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const onSubmit: SubmitHandler<TForgetPasswordSchema> = async (data) => {
    try {
      const message = await requestPasswordReset({
        role: resetRole,
        email: data.email,
        locale,
      });

      toast.success(message);
      setUserEmail(data.email);
      // reset();
      setIsModalOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset code.",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <InputField
          // label={usesOfficialEmail ? "Official Email" : "Email"}
          label={"Email"}
          id="email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
          placeholder="ex:mail@mail.com"
        />
        <Button
          variant="secondary"
          size="pill"
          className="w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : btnLabel}
        </Button>
      </form>

      <OTPModal
        email={userEmail}
        role={resetRole}
        purpose="password-reset"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default FormForgetPassword;
