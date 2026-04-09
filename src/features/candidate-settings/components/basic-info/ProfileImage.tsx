"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ProfileImageProps {
  value?: File[] | string | null;
  onChange: (files: File[]) => void;
  error?: string | boolean;
}

const ProfileImage = ({ value, onChange, error }: ProfileImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    const selectedFile = Array.isArray(value) ? value[0] : null;

    if (selectedFile instanceof File) {
      return URL.createObjectURL(selectedFile);
    }

    return typeof value === "string" ? value : null;
  }, [value]);

  return (
    <div className="w-full">
      <div className="relative flex justify-center">
        <div
          className={cn(
            "relative flex h-37.5 w-37.5 cursor-pointer items-center justify-center rounded-full border bg-white ring-4 ring-white",
            error && "border-red-500",
          )}
        >
          <Image
            src={preview ? preview : "/assets/image_2.svg"}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />

          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              onChange([file]);
            }}
          />

          <div
            onClick={() => inputRef.current?.click()}
            className="bg-primary absolute right-3 bottom-0 flex h-7 w-7 items-center justify-center rounded-full transition"
          >
            <Plus width={16} className="text-white" />
          </div>
        </div>
      </div>
      {typeof error === "string" && error ? (
        <span className="mt-2 block text-center text-[12px] text-red-500">
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default ProfileImage;
