import { IWizardSchema } from "../schema/wizard.schema";

export type WizardFormData = IWizardSchema;

export type StepConfig = {
    component: React.ComponentType;
    fields: (keyof WizardFormData)[];
};