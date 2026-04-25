"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect } from "react";

import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { YearPicker } from "@/shared/components/YearPicker";
import { BasicInfoSchema, TBasicInfoSchema } from "../../validation/basic-info-schema";
import { OTPModal } from "@/features/auth/components/forget-password/OtpModal";
import { useSession } from "next-auth/react";
import { useUpdateBasicInfo } from "../../hooks/useUpdateBasicInfo";
import { parsePhoneNumber, getCountries, getCountryCallingCode, Country } from "react-phone-number-input";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import useGetDomains from "@/shared/hooks/useGetDomains";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { TCompanyProfileViewModel } from "@/features/company-profile/types";
import { UpdateEmailModal } from "./UpdateEmailModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build react-hook-form default values from user data. */
const buildDefaults = (
  user?: TCompanyProfileViewModel
): TBasicInfoSchema => {
  const cleanPhone = (phone?: string | null) => phone?.replace(/[^\d]/g, "") || "";

  return {
    companyName: user?.name ?? "",
    officialEmail: user?.email ?? "",
    domain: user?.domain_id?.toString() ?? "",
    personFullName: user?.person_name ?? "",
    phoneNumber: user?.person_phone
      ? `${user.person_phone_code ?? ""}${cleanPhone(user.person_phone)}`
      : "",
    orgOfficialPhoneNumber: user?.phone
      ? `${user.phone_code ?? ""}${cleanPhone(user.phone)}`
      : "",
    country: user?.country_id?.toString() ?? "",
    city: user?.city_id?.toString() ?? "",
    dateOfEstablishment: user?.established_date ?? "",
  };
};

/** Parse an international phone string into code + national number. */
const parsePhoneData = (phoneNumber: string) => {
  if (!phoneNumber) return { phone: "", phone_code: "" };
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return {
      phone: parsed?.nationalNumber ?? "",
      phone_code: parsed?.countryCallingCode
        ? `+${parsed.countryCallingCode}`
        : "",
    };
  } catch {
    return { phone: phoneNumber, phone_code: "" };
  }
};

/** Get default ISO country code based on calling code. */
const getCountryCodeByPhoneCode = (phoneCode?: string | null): Country => {
  if (!phoneCode) return "EG";
  const numericCode = phoneCode.replace(/\D/g, "");
  const match = getCountries().find(
    (country) => getCountryCallingCode(country) === numericCode
  );
  return match || "EG";
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BasicInfoForm = () => {
  // ── session & user data ──────────────────────────────────────────────
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const { data: userData } = useGetCompanyProfile({ token });

  // ── modals ──────────────────── ───────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOtpOpen, setIsModalOtpOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ── lookups ──────────────────────────────────────────────────────────
  const {
    domains,
    isLoading: domainsLoading,
    hasNextPage: domainsHasNextPage,
    fetchNextPage: domainsFetchNextPage,
    isFetchingNextPage: domainsIsFetchingNextPage,
  } = useGetDomains();

  const {
    countries,
    isLoading: countriesLoading,
    hasNextPage: countriesHasNextPage,
    fetchNextPage: countriesFetchNextPage,
    isFetchingNextPage: countriesIsFetchingNextPage,
  } = useGetCountries();

  // ── mutation ─────────────────────────────────────────────────────────
  const { mutate: updateBasicInfo, isPending } = useUpdateBasicInfo({ token });

  // ── form ─────────────────────────────────────────────────────────────
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TBasicInfoSchema>({
    resolver: zodResolver(BasicInfoSchema),
    mode: "onChange",
    defaultValues: buildDefaults(userData),
  });
  const officialEmail = useWatch({ control, name: "officialEmail" });
  const selectedCountryValue = useWatch({ control, name: "country" });
  const selectedCountryId = selectedCountryValue
    ? parseInt(selectedCountryValue, 10) || null
    : null;

  const {
    cities,
    isLoading: citiesLoading,
    hasNextPage: citiesHasNextPage,
    fetchNextPage: citiesFetchNextPage,
    isFetchingNextPage: citiesIsFetchingNextPage,
  } = useGetCitiesByCountryId(selectedCountryId ?? 0);

  // Sync form values when session data arrives (async).
  useEffect(() => {
    if (!userData) return;
    reset(buildDefaults(userData));
  }, [userData, reset]);

  // ── submit handler ───────────────────────────────────────────────────
  const onSubmit: SubmitHandler<TBasicInfoSchema> = (data) => {
    const personPhone = parsePhoneData(data.phoneNumber);
    const orgPhone = parsePhoneData(data.orgOfficialPhoneNumber);

    // console.log("data :::", data.phoneNumber, personPhone)

    updateBasicInfo({
      name: data.companyName,
      email: data.officialEmail,
      domain_id: parseInt(data.domain) || 0,
      person_name: data.personFullName,
      person_phone: personPhone.phone,
      person_phone_code: personPhone.phone_code,
      phone: orgPhone.phone,
      phone_code: orgPhone.phone_code,
      country_id: parseInt(data.country) || 0,
      city_id: parseInt(data.city) || 0,
      established_date: data.dateOfEstablishment,
    });
  };
  // console.log("phone :: ", personPhone, orgPhone, data.phoneNumber, data.orgOfficialPhoneNumber);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-5"
      >
        <InputField
          id="companyName"
          label="Company Name"
          type="text"
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
            disabled
            {...register("officialEmail")}
            error={errors.officialEmail?.message}
          />
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="pill"
            className="w-1/3 md:w-50 text-secondary"
          >
            Edit
          </Button>
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
              options={domains.map((jt) => ({
                label: jt.name ?? jt.title ?? String(jt.id),
                value: String(jt.id),
              }))}
              disabled={domainsLoading}
              onReachEnd={() => domainsFetchNextPage()}
              hasNextPage={!!domainsHasNextPage}
              isFetchingNextPage={domainsIsFetchingNextPage}
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
                defaultCountry={getCountryCodeByPhoneCode(userData?.person_phone_code)}
                id="phoneNumber"
                className="w-full"
                placeholder="ex:52 987 6543"
                onChange={(value) => field.onChange(value)}
                error={!!errors.phoneNumber?.message}
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
          <label
            htmlFor="orgOfficialPhoneNumber"
            className="mx-1 -mb-4 font-semibold"
          >
            Organization official phone number
            <span className="mx-1 text-sm text-muted-foreground font-normal">
              option
            </span>
          </label>
          <Controller
            name="orgOfficialPhoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInputCode
                {...field}
                defaultCountry={getCountryCodeByPhoneCode(userData?.phone_code)}
                id="orgOfficialPhoneNumber"
                className="w-full"
                placeholder="ex:52 987 6543"
                onChange={(value) => field.onChange(value)}
                error={!!errors.orgOfficialPhoneNumber?.message}
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
          <label
            htmlFor="country"
            className="mx-1 mb-2 block font-semibold"
          >
            Current Location
          </label>
          <div className="flex items-center gap-2">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectInputField
                  withSearchInput
                  id="country"
                  placeholder="country"
                  {...field}
                  error={errors.country?.message}
                  options={countries.map((country) => ({
                    label: country.name,
                    value: String(country.id),
                  }))}
                  disabled={countriesLoading}
                  onReachEnd={() => countriesFetchNextPage()}
                  hasNextPage={!!countriesHasNextPage}
                  isFetchingNextPage={countriesIsFetchingNextPage}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <SelectInputField
                  withSearchInput
                  id="city"
                  placeholder="city"
                  {...field}
                  error={errors.city?.message}
                  options={cities.map((city) => ({
                    label: city.name,
                    value: String(city.id),
                  }))}
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
          <Button
            variant="secondary"
            hoverStyle="slidePrimary"
            size="pill"
            className="w-1/3 md:w-56"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      {/* enter email modal */}
      <UpdateEmailModal
        setUserEmail={setUserEmail}
        email={officialEmail}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        setIsModalOtpOpen={setIsModalOtpOpen}
      />

      {/* Otp modal  */}
      <OTPModal
        email={userEmail}
        open={isModalOtpOpen}
        onOpenChange={setIsModalOtpOpen}
        role="employer"
        purpose="update-email"
      />
    </>
  );
};

export default BasicInfoForm;
