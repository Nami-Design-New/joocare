import StepOne from "../steps/step-one";
import StepThree from "../steps/step-three";
import StepTwo from "../steps/step-two";
import { StepConfig } from "../types/wizard.types";

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
    fields: ["email", "phone"],
  },
  {
    component: StepThree,
    fields: ["password"],
  },
];
