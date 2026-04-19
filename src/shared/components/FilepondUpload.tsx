"use client";

import { FilePond } from "react-filepond";

import "./filepondPlugins";
// styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

interface FilepondUploadProps {
  files?: File[];
  onChange?: (files: File[]) => void;
  label?: string;
  name?: string;
  serverEndpoint?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  allowImagePreview?: boolean;
  className?: string;
  error?: string | boolean;
  hint?: string;

  value?: string;                          // stores data.image path
  onUploadSuccess: (imagePath: string) => void; // called after upload
  onRemove?: () => void;
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
  hint
}: FilepondUploadProps) {

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-base font-semibold">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {hint && (
            <span className="text-muted-foreground text-sm font-normal">
              {hint}{" "}
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
                const imagePath = response.data.image;
                onUploadSuccess(imagePath);
                load(String(response.data.id)); // ✅ must be a string
              } else {
                error("Upload failed");
              }
            };

            xhr.onerror = () => error("Upload failed");
            xhr.send(formData);

            return {
              abort: () => xhr.abort(),
            };
          },

          // ✅ correct signature: (uniqueFileId, load, error)
          revert: (_uniqueFileId, load, _error) => {
            onRemove?.();
            load(); // required to confirm revert to FilePond
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
