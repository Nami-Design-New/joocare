"use client";

// libraries
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
//components
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  createLoginEmployerSchema,
  TLoginEmployerSchema,
} from "../../validation/employer-login-schema";
import { useLogin } from "../../hooks/useLogin";

const FormEmployerLogin = () => {
  const t = useTranslations();
  const { login } = useLogin("employer");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginEmployerSchema>({
    resolver: zodResolver(
      createLoginEmployerSchema({
        fieldRequired: t("authPage.validation.field-required"),
        emailInvalid: t("authPage.validation.email-invalid"),
        passwordMin: t("authPage.validation.password-min"),
        passwordMax: t("authPage.validation.password-max"),
      }),
    ),
  });
  const onSubmit: SubmitHandler<TLoginEmployerSchema> = async (data) => {
    try {
      await login(data.email, data.password);
    } catch {
      // Toast feedback is handled in the login hook.
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <InputField
        id="email"
        label={t("authPage.common.email")}
        type={"email"}
        placeholder={t("authPage.placeholders.email-compact")}
        {...register("email")}
        error={errors.email?.message}
      />
      <InputField
        id="password"
        type="password"
        label={t("authPage.common.password")}
        placeholder="******"
        {...register("password")}
        error={errors.password?.message}
      />
      <Link href="/auth/employer/forget-password" className="text-xs hover:text-primary">
        {t("authPage.common.forgot-password")}
      </Link>
      <div className="flex justify-center">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("authPage.common.logging-in") : t("header.login")}
        </Button>
      </div>
    </form>
  );
};

export default FormEmployerLogin;
