"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { FilepondUpload } from "@/shared/components/FilepondUpload";
import ProfileImage from "./ProfileImage";
import { SettingBasicInfoSchema, TSettingBasicInfoSchema } from "../../validation/basic-info-schema";

const BasicInfoForm = () => {

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSettingBasicInfoSchema>({
    resolver: zodResolver(SettingBasicInfoSchema),
    mode: 'onChange',
  });
  const onSubmit: SubmitHandler<TSettingBasicInfoSchema> = (data) => {
    console.log(data);
  }

  return (<>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-5"
    >
      <div className={"flex w-full flex-col"}>
        <h3 className="mx-1 mb-1 font-semibold text-base">
          Profile Picture
        </h3>
        <ProfileImage />
      </div>

      <InputField
        id="fullName"
        label="Full Name"
        type={"text"}
        placeholder="ex: JooCore"
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <div className="flex justify-center items-end gap-2">
        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="ex: mail@mail.com"
          disabled={true}
          {...register("email")}
          error={errors.email?.message}
        />
      </div>


      {/* Phone number */}
      <>
        <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
          Phone number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              // {...field}
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

      {/* Job Title */}
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            placeholder="eConsultant Internist"
            {...field}
            error={errors.jobTitle?.message}
            options={[
              { label: "Hospital", value: "hospital" },
              { label: "Software", value: "software" },
              { label: "Company", value: "company" },
            ]}
          />
        )}
      />
      {/* Specialty && Years of Experience */}
      <div className="flex items-center gap-2">
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Specialty"
              id="specialty"
              placeholder="ex: Cardiology"
              {...field}
              error={errors.specialty?.message}
              options={[
                { label: "egypt", value: "egypt" },
                { label: "saudi", value: "saudi" },
                { label: "canada", value: "canada" },
              ]}
            />
          )}
        />
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Years of Experience"
              id="yearsOfExperience"
              placeholder="ex:3-5 years"
              {...field}
              error={errors.yearsOfExperience?.message}
              options={[
                { label: "cairo", value: "cairo" },
                { label: "alex", value: "alex" },
                { label: "reyad", value: "reyad" },
              ]}
            />
          )}
        />
      </div>
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

      <InputField
        id="dateOfBirth"
        type="date"
        label="Date of birth"
        placeholder="ex: mail@mail.com"
        {...register("dateOfBirth")}
        error={errors.dateOfBirth?.message}
      />

      {/* Upload CV */}
      <Controller
        name="uploadCV"
        control={control}
        render={({ field }) => (
          <FilepondUpload
            label={`Upload CV`}
            hint={`"Optional"`}
            files={field.value}
            onChange={field.onChange}
            allowMultiple={false}
            maxFiles={2}
            error={errors.uploadCV?.message}
          />
        )}
      />


      <div className="flex justify-center items-center">
        <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit">
          Save
        </Button>
      </div>

    </form>

  </>

  );
};

export default BasicInfoForm;
