"use client";

import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useUploadImage } from "@/shared/hooks/useUploadImage";

export default function CoverUploadImage() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [coverUploading, setCoverUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [coverLocalPreview, setCoverLocalPreview] = useState<string | null>(null);
  const [logoLocalPreview, setLogoLocalPreview] = useState<string | null>(null);

  const coverValue = useWatch({ control, name: "uploadCoverImage" });
  const logoValue = useWatch({ control, name: "uploadLogoImage" });

  const { mutateAsync: uploadImage } = useUploadImage();

  const coverPreview =
    coverLocalPreview ??
    (coverValue && typeof coverValue === "string"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${coverValue}`
      : null);

  const logoPreview =
    logoLocalPreview ??
    (logoValue && typeof logoValue === "string"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${logoValue}`
      : null);
  const handleCoverChange = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setCoverLocalPreview(localUrl);
    setCoverUploading(true);

    try {
      const response = await uploadImage(file);
      const imagePath = response?.data?.data?.image;

      if (response?.data?.message === "Success" && imagePath) {
        setValue("uploadCoverImage", imagePath);
        // Don't touch localPreview — keep showing the blob URL
      } else {
        throw new Error("Upload failed or no image path returned");
      }
    } catch (error) {
      console.error("Failed to upload cover image", error);
      // Only revoke on failure
      URL.revokeObjectURL(localUrl);
      setCoverLocalPreview(null);
      setValue("uploadCoverImage", null);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleLogoChange = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setLogoLocalPreview(localUrl);
    setLogoUploading(true);

    try {
      const response = await uploadImage(file);
      const imagePath = response?.data?.data?.image;

      if (response?.data?.message === "Success" && imagePath) {
        setValue("uploadLogoImage", imagePath);
        // ✅ Don't touch localPreview — keep showing the blob URL
      } else {
        throw new Error("Upload failed or no image path returned");
      }
    } catch (error) {
      console.error("Failed to upload logo image", error);
      // ❌ Only revoke on failure
      URL.revokeObjectURL(localUrl);
      setLogoLocalPreview(null);
      setValue("uploadLogoImage", null);
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <>
      <div className="w-full h-93.75">
        <div className="relative">

          {/* COVER IMAGE */}
          <Controller
            name="uploadCoverImage"
            control={control}
            render={() => (
              <div
                onClick={() => !coverUploading && coverInputRef.current?.click()}
                className={cn(
                  "relative w-full h-75 rounded-[50px] bg-muted border",
                  "flex flex-col items-center justify-center cursor-pointer",
                  "hover:bg-border transition-colors duration-200",
                  errors.uploadCoverImage ? "border-red-500" : "border-transparent",
                  coverUploading && "pointer-events-none"
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

                {/* Uploading overlay */}
                {coverUploading && (
                  <div className="absolute inset-0 rounded-[50px] bg-black/50 flex flex-col items-center justify-center gap-2 z-10">
                    <svg
                      className="animate-spin text-white"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span className="text-white text-sm font-medium">Uploading...</span>
                  </div>
                )}

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={coverUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = "";
                    handleCoverChange(file);
                  }}
                />
              </div>
            )}
          />

          {/* LOGO IMAGE */}
          <Controller
            name="uploadLogoImage"
            control={control}
            render={() => (
              <div
                onClick={() => !logoUploading && logoInputRef.current?.click()}
                className={cn(
                  "absolute bottom-0 translate-y-1/2 left-6",
                  "w-37.5 h-37.5 rounded-full border",
                  "flex flex-col items-center justify-center cursor-pointer",
                  "bg-[#EBEBEB] hover:bg-[#e0e0e0] transition-colors duration-200",
                  "ring-4 ring-white z-10",
                  errors.uploadLogoImage ? "border-red-500" : "border-transparent",
                  logoUploading && "pointer-events-none"
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
                    <span className="text-[10px] leading-tight">Organization Logo</span>
                  </div>
                )}

                {/* Uploading overlay */}
                {logoUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 z-10">
                    <svg
                      className="animate-spin text-white"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span className="text-white text-[10px] font-medium">Uploading</span>
                  </div>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = "";
                    handleLogoChange(file);
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>

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
