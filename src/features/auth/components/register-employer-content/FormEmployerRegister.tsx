"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import useGetDomains from "@/shared/hooks/useGetDomains";
import { useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { useRegisterEmployer } from "../../hooks/useRegisterEmployer";
import {
  createRegisterEmployerSchema,
  TRegisterEmployerSchema,
} from "../../validation/employer-register-schema";
import { OTPModal } from "../forget-password/OtpModal";

const FormEmployerRegister = () => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    domains,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetDomains();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterEmployerSchema>({
    resolver: zodResolver(
      createRegisterEmployerSchema({
        companyNameRequired: t("authPage.validation.company-name-required"),
        companyNameMin: t("authPage.validation.company-name-min"),
        companyNameMax: t("authPage.validation.company-name-max"),
        emailRequired: t("authPage.validation.email-required"),
        emailInvalid: t("authPage.validation.email-invalid"),
        domainRequired: t("authPage.validation.domain-required"),
        personFullNameRequired: t("authPage.validation.person-full-name-required"),
        personFullNameMin: t("authPage.validation.person-full-name-min"),
        personFullNameMax: t("authPage.validation.person-full-name-max"),
        phoneRequired: t("authPage.validation.phone-required"),
        phoneMax: t("authPage.validation.phone-max"),
        passwordMin: t("authPage.validation.password-min"),
        passwordMax: t("authPage.validation.password-less-than-max"),
        confirmAuthorized: t("authPage.validation.confirm-authorized"),
        termsRequired: t("authPage.validation.terms-required"),
      }),
    ),
    mode: "onChange",
  });

  const email = useWatch({ control, name: "officialEmail" });
  const domainsOptions = domains.map(
    (jt: { id: number | string; name?: string; title?: string }) => ({
      label: jt.name ?? jt.title ?? String(jt.id),
      value: String(jt.id),
    }),
  );

  const { mutate: submitRegister, isPending } = useRegisterEmployer(() =>
    setIsModalOpen(true),
  );

  const onSubmit: SubmitHandler<TRegisterEmployerSchema> = (data) => {
    const parsed = parsePhoneNumber(data.phoneNumber);

    submitRegister({
      name: data.companyName,
      email: data.officialEmail,
      domain_id: Number(data.domain),
      password: data.createPassword,
      person_name: data.personFullName,
      person_phone: parsed?.nationalNumber ?? "",
      person_phone_code: `+${parsed?.countryCallingCode ?? ""}`,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-5"
      >
        <InputField
          id="companyName"
          label={t("authPage.common.company-name")}
          type={"text"}
          placeholder={t("authPage.placeholders.company-name")}
          {...register("companyName")}
          error={errors.companyName?.message}
        />

        <InputField
          id="officialEmail"
          type="email"
          label={t("authPage.common.business-email")}
          placeholder={t("authPage.placeholders.email")}
          {...register("officialEmail")}
          error={errors.officialEmail?.message}
        />

        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <SelectInputField
              id="domain"
              label={t("authPage.common.domain")}
              placeholder={t("authPage.placeholders.domain")}
              withSearchInput={true}
              {...field}
              error={
                errors.domain?.message ??
                (error instanceof Error ? error.message : undefined)
              }
              options={domainsOptions}
              disabled={isLoading}
              onReachEnd={() => fetchNextPage()}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        />
        <InputField
          id="personFullName"
          type="text"
          label={t("authPage.common.contact-person-full-name")}
          placeholder={t("authPage.placeholders.contact-person-full-name")}
          {...register("personFullName")}
          error={errors.personFullName?.message}
        />

        {/* Phone number */}
        <>
          <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
            {t("authPage.common.contact-person-phone-number")}
          </label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInputCode
                {...field}
                defaultCountry="AE"
                id="phoneNumber"
                className="w-full"
                placeholder={t("authPage.placeholders.phone-number")}
                onChange={(value) => field.onChange(value)}
                error={errors.phoneNumber?.message ? true : false}
              />
            )}
          />
          {errors.phoneNumber && (
            <span className="-mt-4 text-[12px] text-red-500">
              {errors.phoneNumber.message}
            </span>
          )}
        </>

        <InputField
          id="createPassword"
          type="password"
          label={t("authPage.common.create-password")}
          placeholder="******"
          {...register("createPassword")}
          error={errors.createPassword?.message}
        />

        <Controller
          name="confirmRegister"
          control={control}
          render={({ field }) => (
            <LabelCheckbox
              id="confirmRegister"
              checked={field.value}
              onCheckedChange={field.onChange}
              error={errors.confirmRegister?.message}
              className="text-sm md:text-base"
            >
              {t("authPage.forms.employer-register.confirm-authorized")}
            </LabelCheckbox>
          )}
        />

        <Controller
          name="termsAndConditions"
          control={control}
          render={({ field }) => (
            <LabelCheckbox
              id="termsAndConditions"
              checked={field.value}
              onCheckedChange={field.onChange}
              error={errors.termsAndConditions?.message}
              className="text-sm md:text-base"
            >
              {t("authPage.forms.employer-register.i-agree-to")}{" "}
              <Link
                href="/terms-conditions"
                target="_blank"
                className="underline-primary text-secondary underline"
              >
                {t("footer.terms-conditions")}
              </Link>
              {" "}{t("authPage.forms.employer-register.and")}{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="underline-primary text-secondary underline"
              >
                {t("footer.data-privacy-security")}
              </Link>
            </LabelCheckbox>
          )}
        />

        <div className="mt-2.5 flex justify-center">
          <Button
            hoverStyle={"slideSecondary"}
            className="w-1/3"
            size={"pill"}
            type="submit"
          // disabled={isSubmitting}
          >
            {isPending ? t("authPage.common.registering") : t("authPage.common.register")}
          </Button>
        </div>
      </form>
      {/* Otp modal  */}
      <OTPModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        email={email}
        role="employer"
        purpose="email-confirm"
      />
    </>
  );
};

export default FormEmployerRegister;
