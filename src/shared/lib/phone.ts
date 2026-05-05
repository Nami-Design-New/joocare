import {
  type Country,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";

export const DEFAULT_PHONE_COUNTRY: Country = "AE";
export const MIN_PHONE_NUMBER_LENGTH = 7;

export const getCountryCodeByPhoneCode = (
  phoneCode?: string | null,
  fallbackCountry: Country = DEFAULT_PHONE_COUNTRY,
): Country => {
  if (!phoneCode) return fallbackCountry;

  const numericCode = phoneCode.replace(/\D/g, "");
  const match = getCountries().find(
    (country) => getCountryCallingCode(country) === numericCode,
  );

  return match || fallbackCountry;
};

export const getNationalPhoneValue = (
  phone?: string | null,
  phoneCode?: string | null,
  fallbackCountry: Country = DEFAULT_PHONE_COUNTRY,
) => {
  if (!phone) return "";

  const trimmedPhone = phone.trim();
  const digitsOnly = trimmedPhone.replace(/\D/g, "");

  if (!digitsOnly) return "";

  try {
    const parsedInternational = parsePhoneNumber(trimmedPhone);
    if (parsedInternational?.nationalNumber) {
      return parsedInternational.nationalNumber;
    }
  } catch {
    // Fall back to parsing with the stored country code below.
  }

  try {
    if (phoneCode) {
      const parsedWithCallingCode = parsePhoneNumber(`${phoneCode}${digitsOnly}`);
      if (parsedWithCallingCode?.nationalNumber) {
        return parsedWithCallingCode.nationalNumber;
      }
    }
  } catch {
    // Fall back to default-country parsing below.
  }

  try {
    const parsedWithDefaultCountry = parsePhoneNumber(
      digitsOnly,
      getCountryCodeByPhoneCode(phoneCode, fallbackCountry),
    );
    return parsedWithDefaultCountry?.nationalNumber ?? digitsOnly;
  } catch {
    return digitsOnly;
  }
};

export const parsePhoneWithCode = (
  phoneNumber: string,
  phoneCode?: string | null,
  fallbackCountry: Country = DEFAULT_PHONE_COUNTRY,
) => {
  return parsePhoneNumber(
    phoneNumber,
    getCountryCodeByPhoneCode(phoneCode, fallbackCountry),
  );
};
