import { z } from "zod";
import { stepOneSchema } from "./stepOne.schema";
import { stepTwoSchema } from "./stepTwo.schema";
import { stepThreeSchema } from "./stepThree.schema";

export const WizardSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema);

export type IWizardSchema = z.infer<typeof WizardSchema>;
