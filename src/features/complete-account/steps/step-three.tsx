"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { TextareaField } from "@/shared/components/TextareaField";
import { Controller, useFormContext } from "react-hook-form";
import CoverUploadImage from "../components/cover-upload-image";

export default function StepThree() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <CoverUploadImage />
      <>
        {" "}
        <label htmlFor={"phoneCode"} className="mx-1  font-semibold">
          Organization official phone number <span className="mx-1 text-muted text-sm">option</span>
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="phoneCode"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="phoneCode"
                placeholder="+999"
                {...field}
                // error={!!errors.phoneCode}
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

      {/* Current Location */}
      <div>
        <label htmlFor="country" className="mx-1 mb-2 block font-semibold">
          Current Location
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                placeholder="country"
                {...field}
                // error={errors.country?.message}
                options={[
                  { label: "egypt", value: "egypt" },
                  { label: "saudi", value: "saudi" },
                  { label: "canada", value: "canada" },
                ]}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="city"
                placeholder="city"
                {...field}
                error={errors.city?.message?.toString()}
                options={[
                  { label: "cairo", value: "cairo" },
                  { label: "alex", value: "alex" },
                  { label: "reyad", value: "reyad" },
                ]}
              />
            )}
          />
        </div>
      </div>
      {/* date of establishment */}
      <InputField
        id="dateEstablishment"
        type="date"
        label="Date of Establishment"
        placeholder="******"
        {...register("dateEstablishment")}
        error={errors.dateEstablishment?.message?.toString()}
      />

      <TextareaField
        id="aboutOrganization"
        label="About the Organization"
        placeholder="ex: About the Organization"
        className="bg-muted rounded-[30px] min-h-46"
        {...register("aboutOrganization")}
        error={errors.aboutOrganization?.message?.toString()}
      />

    </div>
  );
}