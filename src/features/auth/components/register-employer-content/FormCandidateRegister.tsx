"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import { SelectInputField } from "@/shared/components/SelectInputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import {
  RegisterEmployerSchema,
  TRegisterEmployerSchema,
} from "../../validation/employer-register-schema";

const FormCandidateRegister = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterEmployerSchema>({
    resolver: zodResolver(RegisterEmployerSchema),
  });
  const onSubmit: SubmitHandler<TRegisterEmployerSchema> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-6"
    >
      <InputField
        id="fullName"
        label="Full Name"
        type={"text"}
        placeholder="ex: JooCore"
        // {...register("fullName")}
        // error={errors.fullName?.message}
      />

      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="ex: mail@mail.com"
        // {...register("email")}
        // error={errors.email?.message}
      />
      <>
        {" "}
        <label htmlFor={"phoneCode"} className="-mb-5 mx-1 font-semibold">
          Phone number
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="phoneCode"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="phoneCode"
                placeholder="+999"
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.phoneCode}
                showPlaceholderImage={"/assets/flag.svg"}
                className="min-w-29 w-29"
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
          <span className="text-red-500 text-[12px] -mt-4">
            {errors.phoneCode && errors.phoneNumber
              ? "Phone code and phone number are required"
              : errors.phoneCode?.message || errors.phoneNumber?.message}
          </span>
        )}
      </>

      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            placeholder="ex: Hospital"
            value={
              field.value
                ? { label: field.value, value: field.value }
                : undefined
            }
            onChange={(option) => field.onChange(option?.value)}
            // error={errors.jobTitle?.message}
            options={[
              { label: "Hospital", value: "hospital" },
              { label: "Software", value: "software" },
              { label: "Company", value: "company" },
            ]}
          />
        )}
      />
      <>
        {" "}
        <label htmlFor={"phoneCode"} className="-mb-5 mx-1 font-semibold">
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
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
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
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                // error={errors.city?.message}
                options={[
                  { label: "cairo", value: "cairo" },
                  { label: "alex", value: "alex" },
                  { label: "reyad", value: "reyad" },
                ]}
              />
            )}
          />
        </div>
        {(errors.phoneCode || errors.phoneNumber) && (
          <span className="text-red-500 text-[12px] -mt-4">
            {errors.phoneCode && errors.phoneNumber
              ? "Phone code and phone number are required"
              : errors.phoneCode?.message || errors.phoneNumber?.message}
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

      {/* filePond  Upload CV (optional) */}

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
            Do you hold a valid medical license?
          </LabelCheckbox>
        )}
      />

      <InputField
        id="licenseTitle"
        label="License Title"
        placeholder="ex: License Title"
        // {...register("licenseTitle")}
        // error={errors.licenseTitle?.message}
      />

      <InputField
        id="licenseNumber"
        label="License Number"
        placeholder="ex: 23121212"
        // {...register("licenseNumber")}
        // error={errors.licenseNumber?.message}
      />

      {/* filePond  Upload the license image */}



      <div className="flex justify-center mt-2.5">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default FormCandidateRegister;
