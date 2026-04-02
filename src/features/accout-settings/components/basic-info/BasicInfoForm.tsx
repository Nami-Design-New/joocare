"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

import { EnterEmailModal } from "@/features/auth/components/forget-password/EnterEmailModal";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { YearPicker } from "@/shared/components/YearPicker";
import { BasicInfoSchema, TBasicInfoSchema } from "../../validation/basic-info-schema";
import { OTPModal } from "@/features/auth/components/forget-password/OtpModal";

const BasicInfoForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOtpOpen, setIsModalOtpOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TBasicInfoSchema>({
    resolver: zodResolver(BasicInfoSchema),
    mode: 'onChange',
    defaultValues: {
      officialEmail: "ahmed@gmail.com"
    }
  });
  const onSubmit: SubmitHandler<TBasicInfoSchema> = (data) => {
    console.log(data);
  }

  return (<>
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

      <div className="flex justify-center items-end gap-2">
        <InputField
          id="officialEmail"
          type="email"
          label="Official Email"
          placeholder="ex: mail@mail.com"
          disabled={true}
          {...register("officialEmail")}
          error={errors.officialEmail?.message}
        />
        <Button onClick={() => setIsModalOpen(true)} variant={"outline"} size={'pill'} className='w-1/3 md:w-50 text-secondary'>Edit</Button>
      </div>

      <Controller
        name="domain"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="domain"
            label="Domain"
            placeholder="ex: Hospital"
            {...field}
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
              defaultCountry="EG"
              id="phoneNumber"
              className="w-full"
              placeholder="ex:52 987 6543"
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

      {/* Organization official phone number */}
      <>
        <label htmlFor="orgOfficialPhoneNumber" className="mx-1 -mb-4 font-semibold">
          Organization official phone number
          <span className="mx-1 text-sm text-muted-foreground font-normal">option</span>
        </label>
        <Controller
          name="orgOfficialPhoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              defaultCountry="EG"
              id="orgOfficialPhoneNumber"
              className="w-full"
              placeholder="ex:52 987 6543"
              onChange={(value) => field.onChange(value)}
              error={errors.orgOfficialPhoneNumber?.message ? true : false}

            />
          )}
        />
        {errors.orgOfficialPhoneNumber && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.orgOfficialPhoneNumber.message}
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
                error={errors.country?.message}
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
                error={errors.city?.message}
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

      <Controller
        name="dateOfEstablishment"
        control={control}
        render={({ field }) => (
          <YearPicker
            id="dateOfEstablishment"
            label="Date of Establishment"
            placeholder="ex: 2021"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            error={errors.dateOfEstablishment?.message?.toString()}
          />
        )}
      />

      <div className="flex justify-center items-center">
        <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit">
          Save
        </Button>
      </div>

    </form>
    {/* enter email modal */}
    <EnterEmailModal
      setUserEmail={setUserEmail} email={watch("officialEmail")}
      open={isModalOpen} onOpenChange={setIsModalOpen}
      setIsModalOtpOpen={setIsModalOtpOpen} />

    {/* Otp modal  */}
    <OTPModal
      email={userEmail}
      open={isModalOtpOpen} onOpenChange={setIsModalOtpOpen} />
  </>

  );
};

export default BasicInfoForm;
