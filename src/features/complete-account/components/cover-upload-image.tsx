"use client";

import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";

export default function CoverUploadImage() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const coverValue = useWatch({ control, name: "uploadCoverImage" });
  const logoValue = useWatch({ control, name: "uploadLogoImage" });

  const coverPreview = useMemo(
    () => (coverValue instanceof File ? URL.createObjectURL(coverValue) : null),
    [coverValue]
  );

  const logoPreview = useMemo(
    () => (logoValue instanceof File ? URL.createObjectURL(logoValue) : null),
    [logoValue]
  );

  return (
    <>
      <div className=" w-full h-93.75">
        <div className="relative">


          {/* COVER IMAGE */}
          <Controller
            name="uploadCoverImage"
            control={control}
            render={({ field: { value, onChange } }) => {

              return (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className={cn(
                    "relative w-full h-75 rounded-[50px] bg-muted border",
                    "flex flex-col items-center justify-center cursor-pointer",
                    "hover:bg-border transition-colors duration-200",
                    errors.uploadCoverImage
                      ? "border-red-500"
                      : "border-transparent"
                  )}
                >
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      fill
                      className="object-cover rounded-[50px]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground/50">
                      <Image
                        width={60}
                        height={60}
                        src="/assets/icons/upload-image-icon.svg"
                        alt="upload"
                      />
                      <span className="text-sm">Upload a cover image</span>
                    </div>
                  )}

                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      onChange(file); // Field gets File
                    }}
                  />
                </div>
              );
            }}
          />

          {/* LOGO IMAGE */}
          <Controller
            name="uploadLogoImage"
            control={control}
            render={({ field: { value, onChange } }) => {

              return (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className={cn(
                    "absolute bottom-0 translate-y-1/2 left-6",
                    "w-37.5 h-37.5 rounded-full border",
                    "flex flex-col items-center justify-center cursor-pointer",
                    "bg-[#EBEBEB] hover:bg-[#e0e0e0] transition-colors duration-200",
                    "ring-4 ring-white z-50",
                    errors.uploadLogoImage
                      ? "border-red-500"
                      : "border-transparent"
                  )}
                >
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center text-foreground/50 px-1">
                      <Image
                        width={40}
                        height={40}
                        src="/assets/icons/upload-image-icon.svg"
                        alt="upload"
                      />
                      <span className="text-[10px] leading-tight">
                        Organization Logo
                      </span>
                    </div>
                  )}

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      onChange(file); // Field gets File
                    }}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
        {/* ERRORS */}
        {(errors.uploadCoverImage || errors.uploadLogoImage) && (
          <span className="text-[12px] text-red-500 -mt-2">
            {errors.uploadCoverImage && errors.uploadLogoImage
              ? "Cover and logo are required"
              : errors.uploadCoverImage?.message?.toString() ||
              errors.uploadLogoImage?.message?.toString()}
          </span>
        )}

    </>
  );
}