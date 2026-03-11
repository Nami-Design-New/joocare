"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Controller, useFormContext } from "react-hook-form";

export default function StepOne() {
  const { register, control, formState: { errors }, } = useFormContext();

  return (
    <div className="flex flex-col gap-y-5">

      <InputField
        id="companyName"
        label="Company Name"
        type={"text"}
        placeholder="ex: JooCore"
        disabled={true}
        {...register("companyName")}
        error={errors.companyName?.message?.toString()}
      />

      <InputField
        id="officialEmail"
        type="email"
        label="Official Email"
        placeholder="ex: mail@mail.com"
        disabled={true}
        {...register("officialEmail")}
        error={errors.officialEmail?.message?.toString()}
      />

      <Controller
        name="domain"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="domain"
            label="Domain"
            placeholder="ex: Hospital"
            disabled={true}
            value={
              field.value ? { label: field.value, value: field.value } : null
            }
            onChange={(option) => field.onChange(option?.value)}
            error={errors.domain?.message?.toString()}
            options={[
              { label: "Hospital", value: "hospital" },
              { label: "Software", value: "software" },
              { label: "Company", value: "company" },
            ]}
          />
        )}
      />
      <InputField
        id="personFullName"
        type="text"
        label="Contact person _ full name "
        placeholder="ex: John Doe"
        disabled={true}
        {...register("personFullName")}
        error={errors.personFullName?.message?.toString()}
      />

      <>
        {" "}
        <label htmlFor={"phoneCode"} className="mx-1 -mb-4 font-semibold">
          Contact person _ Phone number
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="phoneCode"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="phoneCode"
                placeholder="+999"
                disabled={true}
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : null
                }
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.phoneCode}
                showPlaceholderImage={"/assets/flag.svg"}
                className="w-29 min-w-29"
                containerStyles="w-fit"

                options={[
                  { label: "+999", value: "+999", image: "/assets/flag.svg" },
                  { label: "+24", value: "+24", image: "/assets/logo_1.svg" },
                  { label: "+55", value: "+55", image: "/assets/flag.svg" },
                ]}
              />
            )}
          />
          <InputField
            id="phoneNumber"
            type="text"
            placeholder="ex:52 987 6543"
            disabled={true}
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message ? true : false}
          />
        </div>
        {(errors.phoneCode || errors.phoneNumber) && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.phoneCode && errors.phoneNumber
              ? "Phone code and phone number are required"
              : errors.phoneCode?.message?.toString() || errors.phoneNumber?.message?.toString()}
          </span>
        )}
      </>


    </div>
  );
}