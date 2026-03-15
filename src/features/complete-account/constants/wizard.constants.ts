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
      "phoneCode",
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
    fields: ["password"],
  },
];

export const defaultValuesWizard: WizardFormData = {
  // default data step one
  companyName: "JooCore",
  officialEmail: "mail@mail.com",
  domain: "hospital",
  personFullName: "John Doe",
  phoneCode: "+999",
  phoneNumber: "52 987 6543",

  // default data step two
  commercialRegister: "111",
  issuingCountryLicense: "1111111",
  organizationSize: "11111",
  commercialRegistrationIssueDate: "111111111",
  commercialRegistrationExpiryDate: "11111",
  commercialRegistrationImage: [],
  employerType: "111",
  medicalFacilityLicenseNumber: "11",
  licenseIssuingAuthority: "1111",
  specialtyScopePractice: "1111111",
  medicalRegistrationIssueDate: "11111",
  medicalRegistrationExpiryDate: "1111",
  medicalLicenseImage: [],

  // default data step three
  password: "",
};
