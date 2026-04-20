import StepOne from "../steps/step-one";
import StepThree from "../steps/step-three";
import StepTwo from "../steps/step-two";
import { StepConfig, WizardFormData } from "../types/wizard.types";

export const steps: StepConfig[] = [
  {
    component: StepOne,
    fields: [
      "name",
      "email",
      "domain_id",
      "person_name",
      "person_phone",
    ],
  },
  {
    component: StepTwo,
    fields: [
      "commercialRegister",
      "issuingCountryLicense",
      "organizationSize",
      "commercialRegistrationIssueDate",
      "commercialRegistrationExpiryDate",
      "commercialRegistrationImage",
      "employerType",
      "medicalFacilityLicenseNumber",
      "licenseIssuingAuthority",
      "specialtyScopePractice",
      "medicalRegistrationIssueDate",
      "medicalRegistrationExpiryDate",
      "medicalLicenseImage",
    ],
  },
  {
    component: StepThree,
    fields: [
      "uploadCoverImage",
      "uploadLogoImage",
      "organizationPhoneNumber",
      "organizationCountry",
      "organizationCity",
      "dateOfEstablishment",
      "aboutOrganization",
    ],
  },
];

export const defaultValuesWizard: WizardFormData = {
  // default data step one
  name: "",
  email: "",
  domain_id: "",
  person_name: "",
  person_phone: "",

  // default data step two
  commercialRegister: "",
  issuingCountryLicense: "",
  organizationSize: "",
  commercialRegistrationIssueDate: "",
  commercialRegistrationExpiryDate: "",
  commercialRegistrationImage: "",
  employerType: "",
  medicalFacilityLicenseNumber: "",
  licenseIssuingAuthority: "",
  specialtyScopePractice: "",
  medicalRegistrationIssueDate: "",
  medicalRegistrationExpiryDate: "",
  medicalLicenseImage: "",

  // default data step three
  uploadCoverImage: "",
  uploadLogoImage: "",
  organizationPhoneNumber: "",
  organizationCountry: "",
  organizationCity: "",
  dateOfEstablishment: "",
  aboutOrganization: "",

};
