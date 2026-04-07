"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect } from "react";

import { EnterEmailModal } from "@/features/auth/components/forget-password/EnterEmailModal";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { YearPicker } from "@/shared/components/YearPicker";
import { BasicInfoSchema, TBasicInfoSchema } from "../../validation/basic-info-schema";
import { OTPModal } from "@/features/auth/components/forget-password/OtpModal";
import { useSession } from "next-auth/react";
import { useUpdateBasicInfo } from "../../hooks/useUpdateBasicInfo";
import { parsePhoneNumber } from "react-phone-number-input";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";

const BasicInfoForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOtpOpen, setIsModalOtpOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { jobTitles, isLoading: jobTitlesLoading, hasNextPage: jobTitlesHasNextPage, fetchNextPage: jobTitlesFetchNextPage, isFetchingNextPage: jobTitlesIsFetchingNextPage } = useGetJobTitles();
  const { countries, isLoading: countriesLoading, hasNextPage: countriesHasNextPage, fetchNextPage: countriesFetchNextPage, isFetchingNextPage: countriesIsFetchingNextPage } = useGetCountries();
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(userData?.country_id || null);
  const { cities, isLoading: citiesLoading, hasNextPage: citiesHasNextPage, fetchNextPage: citiesFetchNextPage, isFetchingNextPage: citiesIsFetchingNextPage } = useGetCitiesByCountryId(selectedCountryId || 0);

  const { data: session } = useSession()
  const token = session?.accessToken || "";
  const userData = session?.user

  const { mutate: updateBasicInfo } = useUpdateBasicInfo({ token });


  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TBasicInfoSchema>({
    resolver: zodResolver(BasicInfoSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: userData?.name || "",
      officialEmail: userData?.email || "",
      domain: userData?.domain_id?.toString() || "",
      personFullName: userData?.person_name || "",
      phoneNumber: userData?.person_phone ? `${userData.person_phone_code}${userData.person_phone}` : "",
      orgOfficialPhoneNumber: userData?.phone ? `${userData.phone_code}${userData.phone}` : "",
      country: userData?.country_id?.toString() || "",
      city: userData?.city_id?.toString() || "",
      dateOfEstablishment: userData?.established_date || "",
    }
  });

  useEffect(() => {
    if (userData) {
      reset({
        companyName: userData.name || "",
        officialEmail: userData.email || "",
        domain: userData.domain_id?.toString() || "",
        personFullName: userData.person_name || "",
        phoneNumber: userData.person_phone ? `${userData.person_phone_code}${userData.person_phone}` : "",
        orgOfficialPhoneNumber: userData.phone ? `${userData.phone_code}${userData.phone}` : "",
        country: userData.country_id?.toString() || "",
        city: userData.city_id?.toString() || "",
        dateOfEstablishment: userData.established_date || "",
      });
      if (userData.country_id) {
        setSelectedCountryId(userData.country_id);
      }
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<TBasicInfoSchema> = (data) => {
    console.log("data", data);

    // Parse phone numbers to extract code and number
    const parsePhoneData = (phoneNumber: string) => {
      if (!phoneNumber) return { phone: "", phone_code: "" };
      try {
        const parsed = parsePhoneNumber(phoneNumber);
        return {
          phone: parsed?.nationalNumber || "",
          phone_code: parsed?.countryCallingCode ? `+${parsed.countryCallingCode}` : ""
        };
      } catch {
        return { phone: phoneNumber, phone_code: "" };
      }
    };

    const personPhoneData = parsePhoneData(data.phoneNumber);
    const orgPhoneData = parsePhoneData(data.orgOfficialPhoneNumber);

    updateBasicInfo({
      name: data.companyName,
      email: data.officialEmail,
      domain_id: parseInt(data.domain) || 0,
      person_name: data.personFullName,
      person_phone: personPhoneData.phone,
      person_phone_code: personPhoneData.phone_code,
      phone: orgPhoneData.phone,
      phone_code: orgPhoneData.phone_code,
      country_id: parseInt(data.country) || 0,
      city_id: parseInt(data.city) || 0,
      established_date: data.dateOfEstablishment,
    })
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
            options={
              jobTitles.map((jt) => ({
                label: jt.name ?? jt.title ?? String(jt.id),
                value: String(jt.id),
              }))
            }
            disabled={jobTitlesLoading}
            onReachEnd={() => jobTitlesFetchNextPage()}
            hasNextPage={!!jobTitlesHasNextPage}
            isFetchingNextPage={jobTitlesIsFetchingNextPage}
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
                options={
                  countries.map((country) => ({
                    label: country.name,
                    value: String(country.id),
                  }))
                }
                disabled={countriesLoading}
                onReachEnd={() => countriesFetchNextPage()}
                hasNextPage={!!countriesHasNextPage}
                isFetchingNextPage={countriesIsFetchingNextPage}
                onChange={(value) => {
                  field.onChange(value);
                  setSelectedCountryId(parseInt(value) || null);
                }}
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
                options={
                  cities.map((city) => ({
                    label: city.name,
                    value: String(city.id),
                  }))
                }
                disabled={citiesLoading || !selectedCountryId}
                onReachEnd={() => citiesFetchNextPage()}
                hasNextPage={!!citiesHasNextPage}
                isFetchingNextPage={citiesIsFetchingNextPage}
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
