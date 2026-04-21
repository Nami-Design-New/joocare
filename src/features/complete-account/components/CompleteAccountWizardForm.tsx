"use client";

import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { FormProvider, useForm } from "react-hook-form";
import SuccessModal from "@/shared/components/modals/SuccessModal";

import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { steps } from "../constants/wizard.constants";
import { useWizard } from "../hooks/use-wizard";
import { usePostStepOne } from "../hooks/usePostStepOne";
import { usePostStepThree } from "../hooks/usePostStepThree";
import { usePostStepTwo } from "../hooks/usePostStepTwo";
import { defaultValuesWizard } from "../constants/wizard.constants";
import { WizardSchema } from "../schema/wizard.schema";
import { WizardFormData } from "../types/wizard.types";
import WizardNavigation from "./wizard-navigation";
import WizardProgress from "./wizard-progress";

const COMPLETE_ACCOUNT_FORM_STEPS = [
  "Account Setup",
  "Business Verification",
  "Company Profile",
];

const cleanPhone = (phone?: string | null) => phone?.replace(/[^\d]/g, "") || "";
const formatDateForInput = (value?: string | Date | null) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const formatDateForApi = (value?: string | Date | null) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value.toISOString().slice(0, 10);
};

export default function CompleteAccountWizardForm() {

  // hooks locale and token
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // get profile data
  const { data: profileData } = useGetCompanyProfile({ token });
  // hooks
  const { mutateAsync: postStepOne, isPending: isPendingStepOne } = usePostStepOne({ token });
  const { mutateAsync: postStepTwo, isPending: isPendingStepTwo } = usePostStepTwo({ token });
  const { mutateAsync: postStepThree, isPending: isPendingStepThree } = usePostStepThree({ token });

  const wizard = useWizard(steps.length);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const methods = useForm<WizardFormData>({
    resolver: typedZodResolver(WizardSchema),
    defaultValues: defaultValuesWizard,
    mode: "onChange",
  });

  // hydrate form
  useEffect(() => {
    if (profileData) {
      const profileImages = profileData as typeof profileData & {
        cover?: string | null;
        image?: string | null;
      };

      methods.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        domain_id: profileData.domain_id?.toString() || "",
        person_name: profileData.person_name || "",
        person_phone: profileData.person_phone_code && profileData.person_phone
          ? `${profileData.person_phone_code}${cleanPhone(profileData.person_phone)}`
          : "",
        commercialRegister: profileData.commercial_registration_number?.toString() || "",
        issuingCountryLicense: profileData.license_issue_country_id?.toString() || "",
        organizationSize: profileData.organization_size_id?.toString() || "",
        commercialRegistrationIssueDate: formatDateForInput(profileData.commercial_registration_issue_date),
        commercialRegistrationExpiryDate: formatDateForInput(profileData.commercial_registration_expiry_date),
        commercialRegistrationImagePath: profileData.commercial_registration_image || "",
        employerType: profileData.employer_type_id?.toString() || "",
        medicalFacilityLicenseNumber: profileData.medical_facility_license_number?.toString() || "",
        licenseIssuingAuthority: profileData.license_issuing_authority || "",
        specialtyScopePractice: profileData.specialty_id?.toString() || "",
        medicalRegistrationIssueDate: formatDateForInput(profileData.medical_license_issue_date),
        medicalRegistrationExpiryDate: formatDateForInput(profileData.medical_license_expiry_date),
        medicalLicenseImagePath: profileData.medical_license_image || "",
        organizationPhoneNumber: profileData.phone_code && profileData.phone
          ? `${profileData.phone_code}${cleanPhone(profileData.phone)}`
          : "",
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
        uploadCoverImage: profileImages.cover || "",
        uploadLogoImage: profileImages.image || "",
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
          commercial_registration_issue_date: formatDateForApi(data.commercialRegistrationIssueDate),
          commercial_registration_expiry_date: formatDateForApi(data.commercialRegistrationExpiryDate),
          license_issue_country_id: data.issuingCountryLicense || "",
          organization_size_id: data.organizationSize || "",
          employer_type_id: data.employerType || "",
          medical_facility_license_number: data.medicalFacilityLicenseNumber || "",
          license_issuing_authority: data.licenseIssuingAuthority || "",
          specialty_id: data.specialtyScopePractice || "",
          medical_license_issue_date: formatDateForApi(data.medicalRegistrationIssueDate),
          medical_license_expiry_date: formatDateForApi(data.medicalRegistrationExpiryDate),
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
        cover: data.uploadCoverImage || "",
        image: data.uploadLogoImage || "",
      });
      setIsOpenSuccessModal(true);
      // console.log("All steps submitted successfully!");
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

      <SuccessModal
        open={isOpenSuccessModal}
        onOpenChange={setIsOpenSuccessModal}
        title="Saved successfully"
        description="You can return to complete the job details and publish them at any time from the 'Job Management' list."
      />
    </FormProvider>
  );
}
