import { OTHER_OPTION } from '../constants';
import type { AdditionalInfoValues } from '../types/additional-info.types';

const YES_NO: Record<AdditionalInfoValues['relocation'], string> = {
  yes: '1',
  no: '0',
  '': '',
};

// Builds the `POST USER/profile-details` form. The endpoint only updates the fields
// it receives, and an empty value clears a field (`name=` also clears a list).
// Not sent: the free-text "Other" values (Q-B18, Q-B21). Sponsorship and license
// country accept one value for now (Q-B20, Q-B21), so only the first choice is sent.
export function toProfileDetailsFormData(
  values: AdditionalInfoValues,
): FormData {
  const formData = new FormData();

  const single = (name: string, value: string) => formData.append(name, value);
  const list = (name: string, items: string[]) => {
    const ids = items.filter((item) => item && item !== OTHER_OPTION);
    if (!ids.length) {
      formData.append(name, '');
      return;
    }
    ids.forEach((id) => formData.append(`${name}[]`, id));
  };
  const first = (items: string[]) =>
    items.find((item) => item !== OTHER_OPTION) ?? '';

  single('current_role_experience_id', values.yearsInRole);
  single('seniority_level_id', values.seniorityLevel);
  single('education_level_id', values.educationLevel);
  list('mandatory_certification_ids', values.certifications);
  single('primary_license_id', values.professionalLicense);
  single('license_country_id', first(values.professionalLicenseCountries));
  single('license_status', values.licenseStatus);
  single('license_verification_status', values.verificationStatus);

  const languages = values.languages.filter(({ language }) => language);
  if (!languages.length) formData.append('languages', '');
  languages.forEach(({ language, proficiency }, index) => {
    formData.append(`languages[${index}][language]`, language);
    formData.append(`languages[${index}][proficiency_level]`, proficiency);
  });

  single('willing_to_relocate', YES_NO[values.relocation]);
  list(
    'relocation_country_ids',
    values.relocation === 'yes' ? values.preferredCountries : [],
  );
  single('has_driving_license', YES_NO[values.drivingLicense]);
  list(
    'driving_license_country_ids',
    values.drivingLicense === 'yes' ? values.licenseCountries : [],
  );

  list('job_title_ids', values.designations);
  list('preferred_country_ids', values.workLocations);
  list('domain_ids', values.industries);
  single('availability_id', values.noticePeriod);
  single('job_search_status', values.jobSearchStatus);
  list('clinical_privileges', values.clinicalPrivileges);

  single('nationality_id', values.nationality);
  single('country_id', values.currentCountry);
  single('city_id', values.currentCity);
  single('visa_status', values.visaStatus);
  single('gender', values.gender);
  single('sponsorship_requirement', first(values.sponsorship));
  single('marital_status', values.maritalStatus);
  single('religion_id', values.religion);

  single('current_salary', values.currentSalary);
  single('current_salary_currency_id', values.currentCurrency);
  single('expected_salary_min', values.expectedMin);
  single('expected_salary_max', values.expectedMax);
  single('expected_salary_currency_id', values.expectedCurrency);

  return formData;
}
