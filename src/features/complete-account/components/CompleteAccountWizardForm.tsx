"use client";

import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { FormProvider, useForm } from "react-hook-form";

import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { steps } from "../constants/wizard.constants";
import { useWizard } from "../hooks/use-wizard";
import { usePostStepOne } from "../hooks/usePostStepOne";
import { usePostStepThree } from "../hooks/usePostStepThree";
import { usePostStepTwo } from "../hooks/usePostStepTwo";
import { WizardSchema } from "../schema/wizard.schema";
import { WizardFormData } from "../types/wizard.types";
import WizardNavigation from "./wizard-navigation";
import WizardProgress from "./wizard-progress";

const COMPLETE_ACCOUNT_FORM_STEPS = [
  "Account Setup",
  "Business Verification",
  "Company Profile",
];

export default function CompleteAccountWizardForm() {

  // hooks locale and token
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // get profile data
  const { data: profileData } = useGetCompanyProfile({ token });
  console.log(profileData);
  // hooks
  const { mutateAsync: postStepOne, isPending: isPendingStepOne } = usePostStepOne({ token });
  const { mutateAsync: postStepTwo, isPending: isPendingStepTwo } = usePostStepTwo({ token });
  const { mutateAsync: postStepThree, isPending: isPendingStepThree } = usePostStepThree({ token });

  const wizard = useWizard(steps.length);

  const methods = useForm<WizardFormData>({
    resolver: typedZodResolver(WizardSchema),
    mode: "onChange",
  });

  // hydrate form
  useEffect(() => {
    if (profileData) {
      methods.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        domain_id: profileData.domain_id?.toString() || "",
        person_name: profileData.person_name || "",
        person_phone: profileData.person_phone_code && profileData.person_phone
          ? `${profileData.person_phone_code}${profileData.person_phone}`
          : "",
        commercialRegister: profileData.commercial_registration_number?.toString() || "",
        issuingCountryLicense: profileData.license_issue_country_id?.toString() || "",
        organizationSize: profileData.organization_size_id?.toString() || "",
        commercialRegistrationIssueDate: profileData.commercial_registration_issue_date ? new Date(profileData.commercial_registration_issue_date) : undefined as unknown as Date,
        commercialRegistrationExpiryDate: profileData.commercial_registration_expiry_date ? new Date(profileData.commercial_registration_expiry_date) : undefined as unknown as Date,
        employerType: profileData.employer_type_id?.toString() || "",
        medicalFacilityLicenseNumber: profileData.medical_facility_license_number?.toString() || "",
        licenseIssuingAuthority: profileData.license_issuing_authority || "",
        specialtyScopePractice: profileData.specialty_id?.toString() || "",
        medicalRegistrationIssueDate: profileData.medical_license_issue_date ? new Date(profileData.medical_license_issue_date) : undefined as unknown as Date,
        medicalRegistrationExpiryDate: profileData.medical_license_expiry_date ? new Date(profileData.medical_license_expiry_date) : undefined as unknown as Date,
        organizationPhoneNumber: profileData.phone_code && profileData.phone ? `${profileData.phone_code}${profileData.phone}` : "",
        organizationCountry: profileData.country_id?.toString() || "",
        organizationCity: profileData.city_id?.toString() || "",
        dateOfEstablishment: profileData.established_date || "",
        aboutOrganization: profileData.bio || "",
        facebook: profileData.facebook || "",
        XTwitter: profileData.twitter || "",
        linkedIn: profileData.linkedin || "",
        instagram: profileData.instagram || "",
        snapchat: profileData.snapchat || "",
        website: profileData.website || "",
        uploadCoverImage: (profileData as any).cover_image || "",
        uploadLogoImage: (profileData as any).logo_image || "",
      });
    }
  }, [profileData, methods]);

  const currentStep = steps[wizard.step];
  const StepComponent = currentStep.component;

  const nextStep = async () => {
    const valid = await methods.trigger(currentStep.fields);

    if (!valid) return;

    try {
      const data = methods.getValues();
      if (wizard.step === 0) {
        const phoneParsed = data.person_phone ? parsePhoneNumber(data.person_phone) : null;
        await postStepOne({
          name: data.name || "",
          email: data.email || "",
          domain_id: data.domain_id || "",
          person_name: data.person_name || "",
          person_phone: phoneParsed?.nationalNumber || data.person_phone || "",
          person_phone_code: phoneParsed ? `+${phoneParsed.countryCallingCode}` : "",
        });
      } else if (wizard.step === 1) {
        await postStepTwo({
          commercial_registration_number: data.commercialRegister || "",
          commercial_registration_issue_date: data.commercialRegistrationIssueDate?.toISOString?.() || "",
          commercial_registration_expiry_date: data.commercialRegistrationExpiryDate?.toISOString?.() || "",
          license_issue_country_id: data.issuingCountryLicense || "",
          organization_size_id: data.organizationSize || "",
          employer_type_id: data.employerType || "",
          medical_facility_license_number: data.medicalFacilityLicenseNumber || "",
          license_issuing_authority: data.licenseIssuingAuthority || "",
          specialty_id: data.specialtyScopePractice || "",
          medical_license_issue_date: data.medicalRegistrationIssueDate?.toISOString?.() || "",
          medical_license_expiry_date: data.medicalRegistrationExpiryDate?.toISOString?.() || "",
          commercial_registration_image: data.commercialRegistrationImagePath || profileData?.commercial_registration_image || "",
          medical_license_image: data.medicalLicenseImagePath || profileData?.medical_license_image || "",
        });
      }
      wizard.next();
    } catch (error) {
      console.error("Failed to submit step", error);
    }
  };

  // handle submit
  const onSubmit = async (data: WizardFormData) => {
    try {
      const phoneParsed = data.organizationPhoneNumber ? parsePhoneNumber(data.organizationPhoneNumber) : null;
      await postStepThree({
        facebook: data.facebook || "",
        twitter: data.XTwitter || "",
        linkedin: data.linkedIn || "",
        instagram: data.instagram || "",
        snapchat: data.snapchat || "",
        website: data.website || "",
        phone: phoneParsed?.nationalNumber || data.organizationPhoneNumber || "",
        phone_code: phoneParsed ? `+${phoneParsed.countryCallingCode}` : "",
        country_id: Number(data.organizationCountry),
        city_id: Number(data.organizationCity),
        established_date: data.dateOfEstablishment || "",
        bio: data.aboutOrganization || "",
        cover_image: typeof data.uploadCoverImage === "string" ? data.uploadCoverImage : "",
        logo_image: typeof data.uploadLogoImage === "string" ? data.uploadLogoImage : "",
      });
      console.log("All steps submitted successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <WizardProgress
          step={wizard.step}
          steps={COMPLETE_ACCOUNT_FORM_STEPS}
        />

        <StepComponent />

        <WizardNavigation
          isFirstStep={wizard.isFirstStep}
          isLastStep={wizard.isLastStep}
          next={nextStep}
          prev={wizard.prev}
          isPending={isPendingStepOne || isPendingStepTwo || isPendingStepThree}
        />
      </form>
    </FormProvider>
  );
}
