"use client";

import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { TextareaField } from "@/shared/components/TextareaField";
import { useSession } from "next-auth/react";
import { getCountryCodeByPhoneCode, parsePhoneWithCode } from "@/shared/lib/phone";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import CoverUploadImage from "../components/cover-upload-image";
import Image from "next/image";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { YearPicker } from "@/shared/components/YearPicker";
import { useState } from "react";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import { useTranslations } from "next-intl";

export default function StepThree() {
  const t = useTranslations();
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const { data: profileData } = useGetCompanyProfile({ token });
  const { register, control, setValue, formState: { errors } } = useFormContext();

  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const {
    countries,
    isLoading: isCountriesLoading,
    error: countriesError,
    hasNextPage: hasMoreCountries,
    fetchNextPage: fetchMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useGetCountries(countrySearch);

  const selectedCountry = useWatch({
    control,
    name: "organizationCountry",
  });
  const organizationPhoneNumber = useWatch({
    control,
    name: "organizationPhoneNumber",
  });
  const organizationPhoneCountry = (() => {
    try {
      return organizationPhoneNumber
        ? parsePhoneWithCode(organizationPhoneNumber, profileData?.phone_code)?.country ||
            getCountryCodeByPhoneCode(profileData?.phone_code)
        : getCountryCodeByPhoneCode(profileData?.phone_code);
    } catch {
      return getCountryCodeByPhoneCode(profileData?.phone_code);
    }
  })();

  const {
    cities,
    isLoading: isCitiesLoading,
    error: citiesError,
    hasNextPage: hasMoreCities,
    fetchNextPage: fetchMoreCities,
    isFetchingNextPage: isFetchingMoreCities,
  } = useGetCitiesByCountryId(Number(selectedCountry), citySearch);

  return (<>
    <div className="space-y-4 flex flex-col">
      <CoverUploadImage />

      {/* phone number */}
      <>
        <label htmlFor={"organizationPhoneCode"} className="mx-1 font-semibold mb-2">
          {t("completeAccount.stepThree.organization-official-phone")}
          <span className="text-muted-foreground text-sm font-normal mx-2">
            {t("companyPage.common.optional")}
          </span>
        </label>
        <Controller
          name="organizationPhoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              defaultCountry={organizationPhoneCountry}
              id="organizationPhoneNumber"
              className="w-full"
              placeholder={t("authPage.placeholders.phone-number")}
              onChange={(value) => field.onChange(value)}
              error={errors.organizationPhoneNumber?.message ? true : false}
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
          {t("companyPage.accountSettings.basicInfo.fields.current-location.label")}
        </label>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Controller
            name="organizationCountry"
            control={control}
            render={({ field }) => (
              <SelectInputField
                withSearchInput={true}
                id="organizationCountry"
                placeholder={t("companyPage.common.country")}
                className="bg-white hover:bg-transparent"
                {...field}
                onChange={(val) => {
                  field.onChange(val);
                  // Clear the city when the country changes
                  setValue("organizationCity", "");
                }}
                error={
                  errors.organizationCountry?.message?.toString() ??
                  (countriesError instanceof Error
                    ? countriesError.message
                    : undefined)
                }
                options={countries.map((country) => ({
                  label: country.name,
                  value: String(country.id),
                }))}
                disabled={isCountriesLoading}
                onReachEnd={() => fetchMoreCountries()}
                hasNextPage={Boolean(hasMoreCountries)}
                isFetchingNextPage={isFetchingMoreCountries}
                onSearchChange={setCountrySearch}
              />
            )}
          />
          <Controller
            name="organizationCity"
            control={control}
            render={({ field }) => (
              <SelectInputField
                withSearchInput={true}
                id="organizationCity"
                placeholder={t("companyPage.common.city")}
                className="bg-white hover:bg-transparent"
                {...field}
                error={
                  errors.organizationCity?.message?.toString() ??
                  (citiesError instanceof Error
                    ? citiesError.message
                    : undefined)
                }
                options={cities.map((city) => ({
                  label: city.name,
                  value: String(city.id),
                }))}
                disabled={isCitiesLoading || !selectedCountry}
                onReachEnd={() => fetchMoreCities()}
                hasNextPage={Boolean(hasMoreCities)}
                isFetchingNextPage={isFetchingMoreCities}
                onSearchChange={setCitySearch}
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
            label={t("companyPage.accountSettings.basicInfo.fields.date-of-establishment.label")}
            placeholder="ex: 2021"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            error={errors.dateOfEstablishment?.message?.toString()}
          />
        )}
      />

      <TextareaField
        id="aboutOrganization"
        label={t("completeAccount.stepThree.about-organization.label")}
        placeholder={t("completeAccount.stepThree.about-organization.placeholder")}
        className="bg-muted rounded-[30px] min-h-46"
        {...register("aboutOrganization")}
        error={errors.aboutOrganization?.message?.toString()}
      />


      <div className="bg-body-bg p-4 rounded-2xl flex flex-col gap-5">
        <h3 className="text-lg font-semibold">{t("completeAccount.stepThree.online-profile")}</h3>

        <InputField
          id="website"
          type="text"
          label={t("companyPage.profile.social.fields.website.label")}
          placeholder={t("companyPage.profile.social.fields.website.placeholder")}
          icon={<Image src='/assets/icons/social-icons/globe.svg' alt={t("companyPage.profile.social.fields.website.icon-alt")} width={20} height={20} />
          }
          {...register("website")}
          error={errors.website?.message?.toString()}
        />
        <InputField
          id="linkedIn"
          type="text"
          label={t("completeAccount.stepThree.social.linkedin")}
          placeholder={t("companyPage.profile.social.fields.linkedin.placeholder")}
          icon={<Image src='/assets/icons/social-icons/linkedin.svg' alt={t("companyPage.profile.social.fields.linkedin.icon-alt")} width={20} height={20} />
          }
          {...register("linkedIn")}
          error={errors.linkedIn?.message?.toString()}
        />
        <InputField
          id="facebook"
          type="text"
          label={t("completeAccount.stepThree.social.facebook")}
          placeholder={t("companyPage.profile.social.fields.facebook.placeholder")}
          icon={<Image src='/assets/icons/social-icons/facebook.svg' alt={t("companyPage.profile.social.fields.facebook.icon-alt")} width={20} height={20} />
          }
          {...register("facebook")}
          error={errors.facebook?.message?.toString()}
        />
        <InputField
          id="XTwitter"
          type="text"
          label={t("completeAccount.stepThree.social.twitter")}
          placeholder={t("companyPage.profile.social.fields.twitter.placeholder")}
          icon={<Image src='/assets/icons/social-icons/twitter.svg' alt={t("companyPage.profile.social.fields.twitter.icon-alt")} width={20} height={20} />
          }
          {...register("XTwitter")}
          error={errors.XTwitter?.message?.toString()}
        />
        <InputField
          id="instagram"
          type="text"
          label={t("completeAccount.stepThree.social.instagram")}
          placeholder={t("companyPage.profile.social.fields.instagram.placeholder")}
          icon={<Image src='/assets/icons/social-icons/instagram.svg' alt={t("companyPage.profile.social.fields.instagram.icon-alt")} width={20} height={20} />
          }
          {...register("instagram")}
          error={errors.instagram?.message?.toString()}
        />
        <InputField
          id="snapchat"
          type="text"
          label={t("completeAccount.stepThree.social.snapchat")}
          placeholder={t("companyPage.profile.social.fields.snapchat.placeholder")}
          icon={<Image src='/assets/icons/social-icons/snap.svg' alt={t("companyPage.profile.social.fields.snapchat.icon-alt")} width={20} height={20} />
          }
          {...register("snapchat")}
          error={errors.snapchat?.message?.toString()}
        />

      </div>
    </div>
  </>

  );
}
