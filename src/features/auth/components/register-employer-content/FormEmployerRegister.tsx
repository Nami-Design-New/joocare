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

const FormEmployerRegister = () => {
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
            value={
              field.value
                ? { label: field.value, value: field.value }
                : undefined
            }
            onChange={(option) => field.onChange(option?.value)}
            error={errors.domain?.message}
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
        {...register("personFullName")}
        error={errors.personFullName?.message}
      />

      <>
        {" "}
        <label htmlFor={"phoneCode"} className="-mb-5 mx-1 font-semibold">
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
              className="underline underline-primary text-secondary"
            >
              Terms & Conditions
            </Link>
            and
            <Link
              href="#"
              className="underline underline-primary text-secondary"
            >
              Privacy Policy.
            </Link>
          </LabelCheckbox>
        )}
      />

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

export default FormEmployerRegister;
