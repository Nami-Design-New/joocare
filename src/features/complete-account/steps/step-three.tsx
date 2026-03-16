"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { TextareaField } from "@/shared/components/TextareaField";
import { Controller, useFormContext } from "react-hook-form";
import CoverUploadImage from "../components/cover-upload-image";
import Image from "next/image";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";

export default function StepThree() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4 flex flex-col">
      <CoverUploadImage />

      {/* phone number */}
      <>
        <label htmlFor={"organizationPhoneCode"} className="mx-1 font-semibold mb-2">
          Organization official phone number
          <span className="text-muted-foreground text-sm font-normal mx-2">
            option</span>
        </label>
        <Controller
          name="organizationPhoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              defaultCountry="EG"
              id="organizationPhoneNumber"
              className="w-full"
              placeholder="Enter phone number"
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.organizationPhoneNumber && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.organizationPhoneNumber.message?.toString()}
          </span>
        )}
      </>

      {/* Current Location */}
      <div>
        <label htmlFor="organizationCountry" className="mx-1 mb-2 block font-semibold">
          Current Location
        </label>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Controller
            name="organizationCountry"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="organizationCountry"
                placeholder="country"
                {...field}
                error={errors.organizationCountry?.message?.toString()}
                options={[
                  { label: "egypt", value: "egypt" },
                  { label: "saudi", value: "saudi" },
                  { label: "canada", value: "canada" },
                ]}
              />
            )}
          />
          <Controller
            name="organizationCity"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="organizationCity"
                placeholder="city"
                {...field}
                error={errors.organizationCity?.message?.toString()}
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
        id="dateOfEstablishment"
        type="date"
        label="Date of Establishment"
        placeholder="******"
        {...register("dateOfEstablishment")}
        error={errors.dateOfEstablishment?.message?.toString()}
      />

      <TextareaField
        id="aboutOrganization"
        label="About the Organization"
        placeholder="ex: About the Organization"
        className="bg-muted rounded-[30px] min-h-46"
        {...register("aboutOrganization")}
        error={errors.aboutOrganization?.message?.toString()}
      />


      <div className="bg-body-bg p-4 rounded-2xl flex flex-col gap-5">
        <h3 className="text-lg font-semibold">Online profile</h3>

        <InputField
          id="website"
          type="text"
          label="Website"
          placeholder="ex: www.joocare.com"
          icon={<Image src='/assets/icons/social-icons/globe.svg' alt="website icon" width={20} height={20} />
          }
          {...register("website")}
          error={errors.website?.message?.toString()}
        />
        <InputField
          id="linkedIn"
          type="text"
          label="LinkedIn"
          placeholder="ex: linkedin.com/in/username"
          icon={<Image src='/assets/icons/social-icons/linkedin.svg' alt="linkedin icon" width={20} height={20} />
          }
          {...register("linkedIn")}
          error={errors.linkedIn?.message?.toString()}
        />
        <InputField
          id="facebook"
          type="text"
          label="Facebook"
          placeholder="ex: facebook.com/username"
          icon={<Image src='/assets/icons/social-icons/facebook.svg' alt="facebook icon" width={20} height={20} />
          }
          {...register("facebook")}
          error={errors.facebook?.message?.toString()}
        />
        <InputField
          id="XTwitter"
          type="text"
          label="X/Twitter"
          placeholder="ex: x.com/username"
          icon={<Image src='/assets/icons/social-icons/twitter.svg' alt="twitter icon" width={20} height={20} />
          }
          {...register("XTwitter")}
          error={errors.XTwitter?.message?.toString()}
        />
        <InputField
          id="instagram"
          type="text"
          label="Instagram"
          placeholder="ex: instagram.com/username"
          icon={<Image src='/assets/icons/social-icons/instagram.svg' alt="instagram icon" width={20} height={20} />
          }
          {...register("instagram")}
          error={errors.instagram?.message?.toString()}
        />
        <InputField
          id="snapchat"
          type="text"
          label="Snapchat"
          placeholder="ex: snapchat.com/username"
          icon={<Image src='/assets/icons/social-icons/snap.svg' alt="snap icon" width={20} height={20} />
          }
          {...register("snapchat")}
          error={errors.snapchat?.message?.toString()}
        />

      </div>
    </div>
  );
}