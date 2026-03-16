"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Camera } from "lucide-react";

type FormValues = {
    uploadCoverImage?: File | string;
    uploadLogoImage?: File | string;
};

const ProfileHeader = () => {
    const {
        control,
        formState: { errors },
    } = useForm<FormValues>();

    const coverInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const coverValue = useWatch({ control, name: "uploadCoverImage" });
    const logoValue = useWatch({ control, name: "uploadLogoImage" });

    const coverPreview = useMemo(() => {
        if (coverValue instanceof File) {
            return URL.createObjectURL(coverValue);
        }
        return coverValue ?? null;
    }, [coverValue]);

    const logoPreview = useMemo(() => {
        if (logoValue instanceof File) {
            return URL.createObjectURL(logoValue);
        }
        return logoValue ?? null;
    }, [logoValue]);

    return (
        <div className="w-full h-93.75 mb-20">
            <div className="relative">

                {/* COVER */}
                <Controller
                    name="uploadCoverImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div
                            className={cn(
                                "relative w-full h-93.75 rounded-[40px] bg-muted border",
                                "flex items-center justify-center cursor-pointer overflow-hidden",
                                "hover:bg-border transition",
                                errors.uploadCoverImage && "border-red-500"
                            )}
                        >
                            <Image
                                src={coverPreview ? coverPreview : "/assets/cover.svg"}
                                alt="Cover"
                                fill
                                className="object-cover"
                            />


                            <input
                                ref={coverInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    onChange(file);
                                }}
                            />
                            <div
                                onClick={() => coverInputRef.current?.click()}
                                className="w-10 h-10 absolute top-4 right-4 bg-secondary transition flex items-center justify-center  rounded-full">
                                <Camera width={24} className="text-white" />
                            </div>
                        </div>
                    )}
                />

                {/* LOGO */}
                <Controller
                    name="uploadLogoImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div
                            className={cn(
                                "absolute -bottom-12 left-8",
                                "w-37.5 h-37.5 rounded-full border bg-white",
                                "flex items-center justify-center cursor-pointer",
                                "ring-4 ring-white",
                                errors.uploadLogoImage && "border-red-500"
                            )}
                        >
                            <Image
                                src={logoPreview ? logoPreview : "/assets/image_2.svg"}
                                alt="Logo"
                                fill
                                className="object-cover rounded-full"
                            />

                            <input
                                ref={logoInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    onChange(file);
                                }}
                            />

                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className="w-7 h-7 absolute bottom-0 right-3 bg-secondary transition flex items-center justify-center  rounded-full">
                                <Camera width={16} className="text-white" />
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default ProfileHeader;