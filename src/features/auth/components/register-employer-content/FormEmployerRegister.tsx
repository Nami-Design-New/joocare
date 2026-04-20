"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

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
  RegisterEmployerSchema,
  TRegisterEmployerSchema,
} from "../../validation/employer-register-schema";
import { OTPModal } from "../forget-password/OtpModal";

const FormEmployerRegister = () => {
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
    watch,
    formState: { errors },
  } = useForm<TRegisterEmployerSchema>({
    resolver: zodResolver(RegisterEmployerSchema),
    mode: "onChange",
  });

  const email = watch("officialEmail");
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
          label="Company Name"
          type={"text"}
          placeholder="ex: JooCore"
          {...register("companyName")}
          error={errors.companyName?.message}
        />

        <InputField
          id="officialEmail"
          type="email"
          label="Official Email"
          placeholder="ex: mail@mail.com"
          {...register("officialEmail")}
          error={errors.officialEmail?.message}
        />

        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <SelectInputField
              id="domain"
              label="Domain"
              placeholder="ex: Hospital"
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
          label="Contact person _ full name "
          placeholder="ex: John Doe"
          {...register("personFullName")}
          error={errors.personFullName?.message}
        />

        {/* Phone number */}
        <>
          <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
            Contact person _ Phone number
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
                placeholder="Enter phone number"
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
          label="Create password"
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
            >
              I confirm that I am an employee of the company and that I am
              authoried to use JooCare services on its behalf.
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
            >
              I agree to the{" "}
              <Link
                href="#"
                className="underline-primary text-secondary underline"
              >
                Terms & Conditions
              </Link>
              and
              <Link
                href="#"
                className="underline-primary text-secondary underline"
              >
                Privacy Policy.
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
            {isPending ? "Registering..." : "Register"}
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
