import StepOne from "../steps/step-one";
import StepThree from "../steps/step-three";
import StepTwo from "../steps/step-two";
import { StepConfig, WizardFormData } from "../types/wizard.types";

export const steps: StepConfig[] = [
  {
    component: StepOne,
    fields: [
      "companyName",
      "officialEmail",
      "domain",
      "personFullName",
      "phoneNumber",
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
  companyName: "JooCore",
  officialEmail: "mail@mail.com",
  domain: "hospital",
  personFullName: "John Doe",
  phoneNumber: "+201011618275",

  // default data step two
  commercialRegister: "",
  issuingCountryLicense: "",
  organizationSize: "",
  commercialRegistrationIssueDate: "",
  commercialRegistrationExpiryDate: "",
  commercialRegistrationImage: [],
  employerType: "",
  medicalFacilityLicenseNumber: "",
  licenseIssuingAuthority: "",
  specialtyScopePractice: "",
  medicalRegistrationIssueDate: "",
  medicalRegistrationExpiryDate: "",
  medicalLicenseImage: [],

  // default data step three
  uploadCoverImage: [],
  uploadLogoImage: [],
  organizationPhoneCode: "",
  organizationPhoneNumber: "",
  organizationCountry: "",
  organizationCity: "",
  dateOfEstablishment: "",
  aboutOrganization: "",
  
};
