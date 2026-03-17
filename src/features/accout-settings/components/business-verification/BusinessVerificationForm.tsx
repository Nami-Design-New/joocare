"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FilepondUpload } from "@/shared/components/FilepondUpload";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { BusinessVerificationSchema, TBusinessVerificationSchema } from "../../validation/business-verification-schema";
import { Button } from "@/shared/components/ui/button";

export default function BusinessVerificationForm() {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TBusinessVerificationSchema>({
        resolver: zodResolver(BusinessVerificationSchema),
    });

    const onSubmit: SubmitHandler<TBusinessVerificationSchema> = (data) => {
        console.log(data);
        // reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
            <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
                <h2 className="text-lg text-disabled font-semibold text-start mt-2">
                    Commercial Registration
                </h2>
                <InputField
                    id="commercialRegister"
                    label="Commercial Registration No"
                    type={"text"}
                    placeholder="ex: 23121212"
                    className="bg-white"
                    {...register("commercialRegister")}
                    error={errors.commercialRegister?.message?.toString()}
                />

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <Controller
                        name="issuingCountryLicense"
                        control={control}
                        render={({ field }) => (
                            <SelectInputField
                                id="issuingCountryLicense"
                                label="Issuing country of the license"
                                placeholder="Select"
                                className="bg-white hover:bg-transparent"
                                {...field}
                                error={errors.issuingCountryLicense?.message?.toString()}
                                options={[
                                    { label: "Hospital", value: "hospital" },
                                    { label: "Software", value: "software" },
                                    { label: "Company", value: "company" },
                                ]}
                            />
                        )}
                    />
                    <Controller
                        name="organizationSize"
                        control={control}
                        render={({ field }) => (
                            <SelectInputField
                                id="organizationSize"
                                label="Organization  Size"
                                placeholder="Select"
                                className="bg-white"
                                {...field}
                                error={errors.organizationSize?.message?.toString()}
                                options={[
                                    { label: "Hospital", value: "hospital" },
                                    { label: "Software", value: "software" },
                                    { label: "Company", value: "company" },
                                ]}
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <InputField
                        id="commercialRegistrationIssueDate"
                        label="Commercial Registration Issue Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("commercialRegistrationIssueDate")}
                        error={errors.commercialRegistrationIssueDate?.message?.toString()}
                    />

                    <InputField
                        id="commercialRegistrationExpiryDate"
                        label="Commercial Registration Expiry Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("commercialRegistrationExpiryDate")}
                        error={errors.commercialRegistrationExpiryDate?.message?.toString()}
                    />

                </div>
                <Controller
                    name="commercialRegistrationImage"
                    control={control}
                    render={({ field }) => (
                        <FilepondUpload
                            className="file-pond-style-custom"
                            label="Commercial Registration Image"
                            files={field.value}
                            onChange={field.onChange}
                            allowMultiple={false}
                            maxFiles={2}
                            allowImagePreview={true}
                            error={errors.commercialRegistrationImage?.message?.toString()}
                        />
                    )}
                />

            </div>

            <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
                <h2 className="text-lg text-disabled font-semibold text-start mt-2">
                    Medical License
                </h2>
                <InputField
                    id="employerType"
                    label="Employer type"
                    type={"text"}
                    placeholder="ex: Full-time"
                    className="bg-white"
                    {...register("employerType")}
                    error={errors.employerType?.message?.toString()}
                />
                <InputField
                    id="medicalFacilityLicenseNumber"
                    label="Medical Facility License Number"
                    type={"text"}
                    placeholder="ex: 23121212"
                    className="bg-white"
                    {...register("medicalFacilityLicenseNumber")}
                    error={errors.medicalFacilityLicenseNumber?.message?.toString()}
                />
                <InputField
                    id="licenseIssuingAuthority"
                    label="License Issuing Authority"
                    type={"text"}
                    placeholder="ex: Dubai Health Authority"
                    className="bg-white"
                    {...register("licenseIssuingAuthority")}
                    error={errors.licenseIssuingAuthority?.message?.toString()}
                />
                <Controller
                    name="specialtyScopePractice"
                    control={control}
                    render={({ field }) => (
                        <SelectInputField
                            id="specialtyScopePractice"
                            label="Specialty / Scope of Practice"
                            placeholder="ex: hospital"
                            className="bg-white hover:bg-transparent"
                            {...field}
                            error={errors.specialtyScopePractice?.message?.toString()}
                            options={[
                                { label: "Hospital", value: "hospital" },
                                { label: "Software", value: "software" },
                                { label: "Company", value: "company" },
                            ]}
                        />
                    )}
                />

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <InputField
                        id="medicalRegistrationIssueDate"
                        label="medical Registration Issue Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("medicalRegistrationIssueDate")}
                        error={errors.medicalRegistrationIssueDate?.message?.toString()}
                    />

                    <InputField
                        id="medicalRegistrationExpiryDate"
                        label="medical Registration Expiry Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("medicalRegistrationExpiryDate")}
                        error={errors.medicalRegistrationExpiryDate?.message?.toString()}
                    />

                </div>
                <Controller
                    name="medicalLicenseImage"
                    control={control}
                    render={({ field }) => (
                        <FilepondUpload
                            className="file-pond-style-custom"
                            label="Medical License Image"
                            files={field.value}
                            onChange={field.onChange}
                            allowMultiple={false}
                            maxFiles={2}
                            allowImagePreview={true}
                            error={errors.medicalLicenseImage?.message?.toString()}
                        />
                    )}
                />

            </div>
            <div className="flex justify-center items-center">

                <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit">
                    Save
                </Button>
            </div>

        </form>
    );
}