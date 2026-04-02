"use client";

import { InputField } from "@/shared/components/InputField";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
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
            {...field}
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


      {/* Phone Number */}
      <>
        <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
          Phone Number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              disabled={true}
              defaultCountry="EG"
              id="phoneNumber"
              className="w-full"
              placeholder="Enter phone number"
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.phoneNumber && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.phoneNumber.message?.toString()}
          </span>
        )}
      </>


    </div>
  );
}