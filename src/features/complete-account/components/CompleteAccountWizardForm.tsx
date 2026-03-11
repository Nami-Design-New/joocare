"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { steps } from "../constants/wizard.constants";
import { useWizard } from "../hooks/use-wizard";
import { WizardSchema } from "../schema/wizard.schema";
import { WizardFormData } from "../types/wizard.types";
import WizardNavigation from "./wizard-navigation";
import WizardProgress from "./wizard-progress";

const defaultValues: WizardFormData = {
    // default data step one
    companyName: "JooCore",
    officialEmail: "mail@mail.com",
    domain: "hospital",
    personFullName: "John Doe",
    phoneCode: "+999",
    phoneNumber: "52 987 6543",

    email: "",
    phone: "",
    password: "",
};

export default function CompleteAccountWizardForm() {
    const wizard = useWizard(steps.length);

    const methods = useForm<WizardFormData>({
        resolver: zodResolver(WizardSchema),
        mode: "onTouched",
        defaultValues
    });

    const currentStep = steps[wizard.step];
    const StepComponent = currentStep.component;

    const nextStep = async () => {
        const valid = await methods.trigger(currentStep.fields);

        if (!valid) return;

        wizard.next();
    };

    const onSubmit = (data: WizardFormData) => {
        console.log("FORM DATA", data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>

                <WizardProgress step={wizard.step} />

                <StepComponent />

                <WizardNavigation
                    isFirstStep={wizard.isFirstStep}
                    isLastStep={wizard.isLastStep}
                    next={nextStep}
                    prev={wizard.prev}
                />

            </form>
        </FormProvider>
    );
}