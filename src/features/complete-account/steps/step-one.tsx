"use client";

import { InputField } from "@/shared/components/InputField";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { SelectInputField } from "@/shared/components/SelectInputField";
import useGetDomains from "@/shared/hooks/useGetDomains";
import { parsePhoneNumber } from "react-phone-number-input";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function StepOne() {
  const { register, control, formState: { errors }, } = useFormContext();
  const personPhone = useWatch({ control, name: "person_phone" });
  const defaultCountry = (() => {
    try {
      return personPhone ? parsePhoneNumber(personPhone)?.country || "AE" : "AE";
    } catch {
      return "AE";
    }
  })();
  const {
    domains,
    hasNextPage: domainsHasNextPage,
    fetchNextPage: domainsFetchNextPage,
    isFetchingNextPage: domainsIsFetchingNextPage,
  } = useGetDomains();

  return (
    <div className="flex flex-col gap-y-5">

      <InputField
        id="name"
        label="Company Name"
        type={"text"}
        placeholder="ex: JooCore"
        disabled={true}
        {...register("name")}
        error={errors.name?.message?.toString()}
      />

      <InputField
        id="email"
        type="email"
        label="Official Email"
        placeholder="ex: mail@mail.com"
        disabled={true}
        {...register("email")}
        error={errors.email?.message?.toString()}
      />

      <Controller
        name="domain_id"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="domain_id"
            label="Domain"
            placeholder="ex: Hospital"
            {...field}
            error={errors.domain_id?.message as string}
            options={domains.map((jt) => ({
              label: jt.name ?? jt.title ?? String(jt.id),
              value: String(jt.id),
            }))}
            disabled={true}
            onReachEnd={() => domainsFetchNextPage()}
            hasNextPage={!!domainsHasNextPage}
            isFetchingNextPage={domainsIsFetchingNextPage}
          />
        )}
      />
      <InputField
        id="person_name"
        type="text"
        label="Contact person _ full name "
        placeholder="ex: John Doe"
        disabled={true}
        {...register("person_name")}
        error={errors.person_name?.message?.toString()}
      />


      {/* Phone Number */}
      <>
        <label htmlFor="person_phone" className="mx-1 -mb-4 font-semibold">
          Phone Number
        </label>
        <Controller
          name="person_phone"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              disabled={true}
              defaultCountry={defaultCountry}
              id="person_phone"
              className="w-full"
              placeholder="Enter phone number"
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.person_phone && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.person_phone.message?.toString()}
          </span>
        )}
      </>


    </div>
  );
}
