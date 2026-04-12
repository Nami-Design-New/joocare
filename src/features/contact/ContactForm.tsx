"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputField } from "@/shared/components/InputField";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { TextareaField } from "@/shared/components/TextareaField";
import { Button } from "@/shared/components/ui/button";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetInquiryTypes from "@/shared/hooks/useGetInquiryTypes";
import SectionTitle from "../home/components/SectionTitle";
import { useSubmitContact } from "./hooks/useSubmitContact";
import type { ContactFormValues, ContactInitialValues, ContactRole } from "./types";
import { contactSchema } from "./validation/contact-schema";

function getDefaultValues(
  role: ContactRole,
  initialValues?: ContactInitialValues,
): ContactFormValues {
  if (role === "employer") {
    return {
      role,
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      phone: "",
      countryId: "",
      cityId: "",
      inquiryTypeId: "",
      message: "",
    };
  }

  return {
    role,
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    phone: "",
    countryId: "",
    cityId: "",
    inquiryTypeId: "",
    message: "",
  };
}

export default function ContactForm({
  role,
  initialValues,
}: {
  role: ContactRole;
  initialValues?: ContactInitialValues;
}) {
  const [inquirySearch, setInquirySearch] = useState("");
  const {
    inquiryTypes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInquiryTypes(inquirySearch);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const defaultValues = useMemo(
    () => getDefaultValues(role, initialValues),
    [role, initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const selectedCountryId = useWatch({
    control,
    name: "countryId",
  });
  const {
    countries,
    isLoading: isCountriesLoading,
    error: countriesError,
    hasNextPage: hasMoreCountries,
    fetchNextPage: fetchMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useGetCountries(countrySearch);
  const {
    cities,
    isLoading: isCitiesLoading,
    error: citiesError,
    hasNextPage: hasMoreCities,
    fetchNextPage: fetchMoreCities,
    isFetchingNextPage: isFetchingMoreCities,
  } = useGetCitiesByCountryId(Number(selectedCountryId), citySearch);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitContact = useSubmitContact(() => {
    reset(getDefaultValues(role, initialValues));
  });

  const inquiryOptions = inquiryTypes.map((type) => ({
    label: type.title ?? type.name ?? "Inquiry type",
    value: String(type.id ?? ""),
  }));

  return (
    <div className="h-full">
      <SectionTitle sectionTitle="REQUEST FOR DEMO" translationKey="requestForDemo" />

      <h2 className="text-secondary my-4 text-2xl font-bold">
        Send your message
      </h2>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => submitContact.mutate(data))}
      >
        <InputField
          label={role === "candidate" ? "Full Name" : "Company Name"}
          id="name"
          placeholder={role === "candidate" ? "ex: Ahmed eltawy" : "ex: JooCare"}
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          label={role === "candidate" ? "Email" : "Official Email"}
          id="email"
          type="email"
          placeholder="ex:mail@mail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {role === "employer" ? (
          <>
            <>
              <label htmlFor="phone" className="mx-1 -mb-4 font-semibold">
                Phone Number
              </label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInputCode
                    {...field}
                    defaultCountry="EG"
                    id="phone"
                    className="w-full"
                    placeholder="Enter phone number"
                    onChange={(value) => field.onChange(value)}
                    error={Boolean(errors.phone?.message)}
                  />
                )}
              />
              {errors.phone ? (
                <span className="-mt-4 text-[12px] text-red-500">
                  {errors.phone.message}
                </span>
              ) : null}
            </>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="countryId"
                render={({ field }) => (
                  <SelectInputField
                    withSearchInput
                    id="countryId"
                    label="Current Location"
                    placeholder="country"
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("cityId", "");
                    }}
                    error={
                      errors.countryId?.message ??
                      (countriesError instanceof Error ? countriesError.message : undefined)
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
                control={control}
                name="cityId"
                render={({ field }) => (
                  <SelectInputField
                    withSearchInput
                    label="City"
                    id="cityId"
                    placeholder="city"
                    {...field}
                    error={
                      errors.cityId?.message ??
                      (citiesError instanceof Error ? citiesError.message : undefined)
                    }
                    options={cities.map((city) => ({
                      label: city.name,
                      value: String(city.id),
                    }))}
                    disabled={isCitiesLoading || !selectedCountryId}
                    onReachEnd={() => fetchMoreCities()}
                    hasNextPage={Boolean(hasMoreCities)}
                    isFetchingNextPage={isFetchingMoreCities}
                    onSearchChange={setCitySearch}
                  />
                )}
              />
            </div>
          </>
        ) : null}

        <Controller
          control={control}
          name="inquiryTypeId"
          render={({ field }) => (
            <SelectInputField
              id="inquiryTypeId"
              label="Type of inquiry"
              placeholder="Select inquiry type"
              options={inquiryOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.inquiryTypeId?.message}
              withSearchInput
              searchPlaceholder="Search inquiry type"
              onSearchChange={setInquirySearch}
              onReachEnd={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        />

        <TextareaField
          label="Message"
          id="message"
          placeholder="Message goes here..."
          rows={6}
          error={errors.message?.message}
          {...register("message")}
        />

        <Button
          type="submit"
          variant="secondary"
          size="pill"
          hoverStyle="slidePrimary"
          className="w-full justify-center"
          disabled={submitContact.isPending}
        >
          {submitContact.isPending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
