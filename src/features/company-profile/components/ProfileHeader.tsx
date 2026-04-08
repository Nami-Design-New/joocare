"use client";

import Image from "next/image";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSession } from "next-auth/react";
import { TCompanyProfileViewModel } from "../types";
import { useUpdateCompanyImagesFlow } from "../hooks/useUpdateCompanyImagesFlow";

type FormValues = {
    uploadCoverImage?: File | string;
    uploadLogoImage?: File | string;
};

const ProfileHeader = ({
    companyProfileData,
}: {
    companyProfileData: TCompanyProfileViewModel;
}) => {
    const { data: session } = useSession();
    const token = session?.accessToken || "";

    const {
        handleChangeImage,
        loadingField,
    } = useUpdateCompanyImagesFlow({ token });

    const { watch, control } = useForm<FormValues>();

    const uploadCoverImage = watch("uploadCoverImage");
    const uploadLogoImage = watch("uploadLogoImage");

    const coverPreview = uploadCoverImage && uploadCoverImage instanceof File
        ? URL.createObjectURL(uploadCoverImage)
        : companyProfileData?.cover;

    const logoPreview = uploadLogoImage && uploadLogoImage instanceof File
        ? URL.createObjectURL(uploadLogoImage)
        : companyProfileData?.image;

    const coverRef = useRef<HTMLInputElement>(null);
    const logoRef = useRef<HTMLInputElement>(null);

    return (
        <div className="w-full h-93.75 mb-20">
            <div className="relative">
                {/* COVER */}
                <Controller
                    name="uploadCoverImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div className="relative w-full h-93.75 rounded-[40px] overflow-hidden border">
                            <Image
                                src={coverPreview || "/assets/cover.svg"}
                                alt="cover"
                                fill
                                className="object-cover"
                            />

                            {loadingField === "cover" && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                    Uploading...
                                </div>
                            )}

                            <input
                                ref={coverRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    onChange(file);

                                    handleChangeImage(file, "cover").then((success) => {
                                        if (!success) {
                                            onChange(undefined);
                                        }
                                    });
                                }}
                            />

                            <button
                                onClick={() => coverRef.current?.click()}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                <Camera className="text-white w-5 h-5" />
                            </button>
                        </div>
                    )}
                />

                {/* LOGO */}
                <Controller
                    name="uploadLogoImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div className={cn(
                            "absolute -bottom-12 left-8",
                            "w-37.5 h-37.5 rounded-full border bg-white",
                            "flex items-center justify-center cursor-pointer",
                            "ring-4 ring-white",
                        )}>
                            <Image
                                src={logoPreview || "/assets/image_2.svg"}
                                alt="logo"
                                fill
                                className="object-cover rounded-full"
                            />

                            {loadingField === "logo" && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs rounded-full">
                                    Uploading...
                                </div>
                            )}

                            <input
                                ref={logoRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    onChange(file);

                                    handleChangeImage(file, "logo").then((success) => {
                                        if (!success) {
                                            onChange(undefined);
                                        }
                                    });
                                }}
                            />

                            <button
                                onClick={() => logoRef.current?.click()}
                                className="w-7 h-7 absolute bottom-0 right-3 bg-secondary transition flex items-center justify-center  rounded-full cursor-pointer"
                            >
                                <Camera className="text-white w-3 h-3 " />
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default ProfileHeader;