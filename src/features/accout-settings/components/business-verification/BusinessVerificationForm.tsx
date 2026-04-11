"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { storeUploadedFileAction } from "@/features/candidate-settings/actions/basic-info-actions";
import useGetBusinessVerification from "@/features/candidate-settings/hooks/useGetBusinessVerification";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import { Button } from "@/shared/components/ui/button";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useUpdateBusinessVerification } from "../../hooks/useUpdateBusinessVerification";
import { UpdateBusinessVerificationPayload } from "../../types";
import { BusinessVerificationSchema, TBusinessVerificationSchema } from "../../validation/business-verification-schema";

export default function BusinessVerificationForm() {
    const locale = useLocale();
    const { data: session } = useSession();
    const token = session?.accessToken as string
    const { data: companyProfileData, isPending: isCompanyProfilePending } = useGetCompanyProfile({ token });

    const { data: bussinessVerificationData, isPending: isBusinessVerificationPending } = useGetBusinessVerification({ token });
    const [commercialRegistrationImage, setCommercialRegistrationImage] = useState<string | null>(null);
    const [showExistingCommercialRegistrationImage, setShowExistingCommercialRegistrationImage] = useState(false);
    const [medicalLicenseImage, setMedicalLicenseImage] = useState<string | null>(null);
    const [showExistingMedicalLicenseImage, setShowExistingMedicalLicenseImage] = useState(false);


    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TBusinessVerificationSchema>({
        resolver: zodResolver(BusinessVerificationSchema),
    });
    const { mutate: updateBusinessVerification, isPending: isUpdating } = useUpdateBusinessVerification({ token });

    useEffect(() => {
        if (companyProfileData) {
            reset({
                commercial_registration_number: companyProfileData.commercial_registration_number?.toString() || "",
                license_issue_country_id: companyProfileData.license_issue_country_id?.toString() || "",
                organization_size_id: companyProfileData.organization_size_id?.toString() || "",
                commercial_registration_issue_date: companyProfileData.commercial_registration_issue_date || "",
                commercial_registration_expiry_date: companyProfileData.commercial_registration_expiry_date || "",
                employer_type_id: companyProfileData.employer_type_id?.toString() || "",
                medical_facility_license_number: companyProfileData.medical_facility_license_number?.toString() || "",
                license_issuing_authority: companyProfileData.license_issuing_authority || "",
                specialty_id: companyProfileData.specialty_id?.toString() || "",
                medical_license_issue_date: companyProfileData.medical_license_issue_date || "",
                medical_license_expiry_date: companyProfileData.medical_license_expiry_date || "",
            });

            if (companyProfileData.commercial_registration_image) {
                setShowExistingCommercialRegistrationImage(true);
            }
            if (companyProfileData.medical_license_image) {
                setShowExistingMedicalLicenseImage(true);
            }
        }
    }, [companyProfileData, reset]);

    const onSubmit: SubmitHandler<TBusinessVerificationSchema> = (data) => {
        const payload: UpdateBusinessVerificationPayload = {
            commercial_registration_number: data.commercial_registration_number,
            commercial_registration_issue_date: data.commercial_registration_issue_date,
            commercial_registration_expiry_date: data.commercial_registration_expiry_date,
            license_issue_country_id: Number(data.license_issue_country_id),
            organization_size_id: Number(data.organization_size_id),
            employer_type_id: Number(data.employer_type_id),
            medical_facility_license_number: data.medical_facility_license_number,
            license_issuing_authority: data.license_issuing_authority,
            specialty_id: Number(data.specialty_id),
            medical_license_issue_date: data.medical_license_issue_date,
            medical_license_expiry_date: data.medical_license_expiry_date,
            medical_license_image: medicalLicenseImage || (showExistingMedicalLicenseImage ? companyProfileData?.medical_license_image : "") || "",
            commercial_registration_image: commercialRegistrationImage || (showExistingCommercialRegistrationImage ? companyProfileData?.commercial_registration_image : "") || "",
        };
        updateBusinessVerification(payload);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
            <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
                <h2 className="text-lg text-disabled font-semibold text-start mt-2">
                    Commercial Registration
                </h2>
                <InputField
                    id="commercial_registration_number"
                    label="Commercial Registration No"
                    type={"text"}
                    placeholder="ex: 23121212"
                    className="bg-white"
                    {...register("commercial_registration_number")}
                    error={errors.commercial_registration_number?.message?.toString()}
                />

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <Controller
                        name="license_issue_country_id"
                        control={control}
                        render={({ field }) => (
                            <SelectInputField
                                id="license_issue_country_id"
                                label="Issuing country of the license"
                                placeholder="Select"
                                className="bg-white hover:bg-transparent"
                                {...field}
                                error={errors.license_issue_country_id?.message?.toString()}
                                options={bussinessVerificationData?.countries?.map((country: {
                                    name: { en: string, ar: string }
                                    id: string
                                }) => ({
                                    label: country.name.en,
                                    value: String(country.id),
                                })) || []}
                                disabled={isBusinessVerificationPending}
                            />
                        )}
                    />
                    <Controller
                        name="organization_size_id"
                        control={control}
                        render={({ field }) => (
                            <SelectInputField
                                id="organization_size_id"
                                label="Organization Size"
                                placeholder="Select"
                                className="bg-white"
                                {...field}
                                error={errors.organization_size_id?.message?.toString()}
                                options={bussinessVerificationData?.organization_sizes?.map((size: {
                                    title: { en: string, ar: string }
                                    id: string
                                }) => ({
                                    label: size.title.en,
                                    value: String(size.id),
                                })) || []}
                                disabled={isBusinessVerificationPending}
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <InputField
                        id="commercial_registration_issue_date"
                        label="Commercial Registration Issue Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("commercial_registration_issue_date")}
                        error={errors.commercial_registration_issue_date?.message?.toString()}
                    />

                    <InputField
                        id="commercial_registration_expiry_date"
                        label="Commercial Registration Expiry Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("commercial_registration_expiry_date")}
                        error={errors.commercial_registration_expiry_date?.message?.toString()}
                    />

                </div>

                <Controller
                    name="commercial_registration_image"
                    control={control}
                    render={({ field }) => (
                        <StoredFilepondUpload
                            className="file-pond-style-custom"
                            label="Commercial Registration Image"
                            files={field.value}
                            onChange={field.onChange}
                            allowImagePreview={false}
                            acceptedFileTypes={[
                                "application/pdf",
                                "application/msword",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ]}
                            processFile={async (file) => {
                                const uploadFormData = new FormData();
                                uploadFormData.append("image", file);
                                return storeUploadedFileAction(uploadFormData, locale);
                            }}
                            onStoredPathChange={(path) => {
                                setCommercialRegistrationImage(path);
                                if (path) {
                                    clearErrors("commercial_registration_image");
                                }
                            }}
                            onUploadError={(message) => {
                                if (!message) {
                                    clearErrors("commercial_registration_image");
                                    return;
                                }

                                setError("commercial_registration_image", {
                                    type: "server",
                                    message,
                                });
                            }}
                            existingFileUrl={showExistingCommercialRegistrationImage ? companyProfileData?.commercial_registration_image : null}
                            existingFileLabel={showExistingCommercialRegistrationImage ? "Existing Commercial Registration Image" : undefined}
                            onExistingFileRemove={() => {
                                setShowExistingCommercialRegistrationImage(false);
                                setCommercialRegistrationImage(null);
                                field.onChange([]);
                            }}
                            allowMultiple={false}
                            maxFiles={1}
                            error={errors.commercial_registration_image?.message as string}
                        />
                    )}
                />

            </div>

            <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
                <h2 className="text-lg text-disabled font-semibold text-start mt-2">
                    Medical License
                </h2>
                <Controller
                    name="employer_type_id"
                    control={control}
                    render={({ field }) => (
                        <SelectInputField
                            id="employer_type_id"
                            label="Employer type"
                            placeholder="ex: Full-time"
                            className="bg-white"
                            {...field}
                            error={errors.employer_type_id?.message?.toString()}
                            options={bussinessVerificationData?.employer_type?.map((type: {
                                title: { en: string, ar: string }
                                id: string
                            }) => ({
                                label: type.title.en,
                                value: String(type.id),
                            })) || []}
                            disabled={isBusinessVerificationPending}
                        />
                    )}
                />
                <InputField
                    id="medical_facility_license_number"
                    label="Medical Facility License Number"
                    type={"text"}
                    placeholder="ex: 23121212"
                    className="bg-white"
                    {...register("medical_facility_license_number")}
                    error={errors.medical_facility_license_number?.message?.toString()}
                />
                <InputField
                    id="license_issuing_authority"
                    label="License Issuing Authority"
                    type={"text"}
                    placeholder="ex: Dubai Health Authority"
                    className="bg-white"
                    {...register("license_issuing_authority")}
                    error={errors.license_issuing_authority?.message?.toString()}
                />
                <Controller
                    name="specialty_id"
                    control={control}
                    render={({ field }) => (
                        <SelectInputField
                            id="specialty_id"
                            label="Specialty / Scope of Practice"
                            placeholder="ex: hospital"
                            className="bg-white hover:bg-transparent"
                            {...field}
                            error={errors.specialty_id?.message?.toString()}
                            options={bussinessVerificationData?.specialties?.map((practice: {
                                title: { en: string, ar: string }
                                id: string
                            }) => ({
                                label: practice.title.en,
                                value: String(practice.id),
                            })) || []}
                            disabled={isBusinessVerificationPending}
                        />
                    )}
                />

                <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                    <InputField
                        id="medical_license_issue_date"
                        label="Medical License Issue Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("medical_license_issue_date")}
                        error={errors.medical_license_issue_date?.message?.toString()}
                    />

                    <InputField
                        id="medical_license_expiry_date"
                        label="Medical License Expiry Date"
                        type={"date"}
                        placeholder="ex:Dec 2025"
                        className="bg-white"
                        {...register("medical_license_expiry_date")}
                        error={errors.medical_license_expiry_date?.message?.toString()}
                    />

                </div>
                <Controller
                    name="medical_license_image"
                    control={control}
                    render={({ field }) => (
                        <StoredFilepondUpload
                            className="file-pond-style-custom"
                            label="Medical License Image"
                            files={field.value}
                            onChange={field.onChange}
                            allowMultiple={false}
                            maxFiles={2}
                            allowImagePreview={true}
                            processFile={async (file) => {
                                const uploadFormData = new FormData();
                                uploadFormData.append("image", file);
                                return storeUploadedFileAction(uploadFormData, locale);
                            }}
                            onStoredPathChange={(path) => {
                                setMedicalLicenseImage(path);
                                if (path) {
                                    clearErrors("medical_license_image");
                                }
                            }}
                            onUploadError={(message) => {
                                if (!message) {
                                    clearErrors("medical_license_image");
                                    return;
                                }

                                setError("medical_license_image", {
                                    type: "server",
                                    message,
                                });
                            }}
                            existingFileUrl={showExistingMedicalLicenseImage ? companyProfileData?.medical_license_image : null}
                            existingFileLabel={showExistingMedicalLicenseImage ? "Existing Medical License Image" : undefined}
                            onExistingFileRemove={() => {
                                setShowExistingMedicalLicenseImage(false);
                                setMedicalLicenseImage(null);
                                field.onChange([]);
                            }}
                            error={errors.medical_license_image?.message?.toString()}
                        />
                    )}
                />

            </div>
            <div className="flex justify-center items-center">

                <Button variant={"secondary"} hoverStyle={'slidePrimary'} size={'pill'} className='w-1/3 md:w-56' type="submit" disabled={isUpdating || isCompanyProfilePending || isBusinessVerificationPending}>
                    {isUpdating ? "Saving..." : "Save"}
                </Button>
            </div>

        </form>
    );
}