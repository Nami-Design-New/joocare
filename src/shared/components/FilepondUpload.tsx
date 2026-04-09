// shared/components/FilepondUpload.tsx
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { FilePond } from "react-filepond";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
//style
import "./filepondPlugins";

interface FilepondUploadProps {
  value?: string;                          // stores data.image path
  onUploadSuccess: (imagePath: string) => void; // called after upload
  onRemove?: () => void;                   // called when file removed
  label?: string;
  name?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  allowImagePreview?: boolean;
  className?: string;
  error?: string | boolean;
  hint?: string;
  processFile?: (file: File) => Promise<{ path: string }>;
  onStoredPathChange?: (path: string | null) => void;
  onUploadError?: (message: string | null) => void;
  acceptedFileTypes?: string[];
  existingFileUrl?: string | null;
  existingFileLabel?: string | null;
  onExistingFileRemove?: () => void;
}

export function FilepondUpload({
  onUploadSuccess,
  onRemove,
  label,
  name = "files",
  allowMultiple = false,
  maxFiles = 1,
  required = false,
  allowImagePreview = false,
  className,
  error,
  hint,
}: FilepondUploadProps) {
  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {hint && (
            <span className="text-muted-foreground text-sm font-normal">
              {" "}{hint}{" "}
            </span>
          )}
        </label>
      )}

      <FilePond
        id={error ? "filepond-error" : ""}
        allowImagePreview={allowImagePreview}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        name={name}
        //  FilePond handles upload internally via server.process
        server={{
          process: (fieldName, file, _metadata, load, error, progress) => {
            const formData = new FormData();
            formData.append("image", file);

            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/images`);

            xhr.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total);
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                const imagePath = response.data.image; // ✅ extract data.image
                onUploadSuccess(imagePath);            // ✅ send to form
                load(response.data.id);                // FilePond needs a server ID
              } else {
                error("Upload failed");
              }
            };

            xhr.onerror = () => error("Upload failed");
            xhr.send(formData);

            // Allow FilePond to abort if needed
            return {
              abort: () => {
                xhr.abort();
              },
            };
          },
          revert: () => {
            onRemove?.(); // ✅ clear the value from form on file remove
          },
        }}
        onremovefile={() => onRemove?.()}
        labelIdle={`
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <img src="/assets/icons/Group.svg" alt="icon image" width="20" height="20"/>
            <span style="font-size:14px;">Drag & Drop your files or Browse</span>
          </div>
        `}
      />

      {error && <span className="mt-1 text-[12px] text-red-500">{error}</span>}
    </div>
  );
}