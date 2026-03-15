// components/cover-upload-image.tsx
"use client";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";

export default function CoverUploadImage() {
  const { control } = useFormContext();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full mb-24">
      {/* Cover Image */}
      <Controller
        name="uploadCoverImage"
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <div
              onClick={() => coverInputRef.current?.click()}
              className={cn(
                "relative w-full h-75 rounded-[50px] bg-muted",
                "flex flex-col items-center justify-center cursor-pointer",
                "hover:bg-border transition-colors duration-200"
              )}
            >
              {value ? (
                <Image
                  src={value}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-[50px]"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-foreground/50">
                  <Image
                    width={60}
                    height={60}
                    src="/assets/icons/upload-image-icon.svg"
                    alt="upload image icon"
                  />
                  <span className="text-sm">upload a cover image</span>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(URL.createObjectURL(file));
                }}
              />
            </div>
          </>
        )}
      />

      {/* Organization Logo */}
      <Controller
        name="uploadLogoImage"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div
            onClick={() => logoInputRef.current?.click()}
            className={cn(
              "absolute bottom-0 translate-y-1/2 left-6 w-37.5 h-37.5 rounded-full",
              "flex flex-col items-center justify-center cursor-pointer",
              "bg-[#EBEBEB] hover:bg-[#e0e0e0] transition-colors duration-200 z-50",
              "ring-4 ring-white"
            )}
          >
            {value ? (
              <Image
                src={value}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                width={200}
                height={200}
              />
            ) : (
              <div className="flex flex-col items-center gap-0.5 text-foreground/50 text-center px-1">
                <Image
                  width={40}
                  height={40}
                  src="/assets/icons/upload-image-icon.svg"
                  alt="upload image icon"
                />
                <span className="text-[10px] leading-tight">Organization Logo</span>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(URL.createObjectURL(file));
              }}
            />
          </div>
        )}
      />
    </div>
  );
}