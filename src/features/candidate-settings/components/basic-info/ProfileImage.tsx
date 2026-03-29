"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Plus } from "lucide-react";

type FormValues = {
    uploadCoverImage?: File | string;
    uploadLogoImage?: File | string;
};

const ProfileImage = () => {
    const {
        control,
        formState: { errors },
    } = useForm<FormValues>();

    const logoInputRef = useRef<HTMLInputElement>(null);
    const logoValue = useWatch({ control, name: "uploadLogoImage" });

    const logoPreview = useMemo(() => {
        if (logoValue instanceof File) {
            return URL.createObjectURL(logoValue);
        }
        return logoValue ?? null;
    }, [logoValue]);

    return (
        <div className="w-full">
            <div className="relative flex justify-center">

                {/* LOGO */}
                <Controller
                    name="uploadLogoImage"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div
                            className={cn(
                                "relative",
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
                                className="w-7 h-7 absolute bottom-0 right-3 bg-primary transition flex items-center justify-center  rounded-full">
                                <Plus width={16} className="text-white" />
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default ProfileImage;