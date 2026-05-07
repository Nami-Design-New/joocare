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
  maxSize?: number;
  acceptedFileTypes?: string[];
  invalidTypeMessage?: string;
  onUploadError?: (message: string | null) => void;
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
  maxSize,
  acceptedFileTypes,
  invalidTypeMessage,
  onUploadError,
}: FilepondUploadProps) {
  const MAX_SIZE = maxSize || 5 * 1024 * 1024;

  const matchesAcceptedType = (file: File) => {
    if (!acceptedFileTypes?.length) {
      return true;
    }

    const fileType = file.type?.toLowerCase();
    const fileName = file.name.toLowerCase();

    return acceptedFileTypes.some((acceptedType) => {
      const normalizedType = acceptedType.toLowerCase();

      if (fileType === normalizedType) {
        return true;
      }

      if (
        normalizedType === "application/pdf" &&
        fileName.endsWith(".pdf")
      ) {
        return true;
      }

      if (
        normalizedType === "application/msword" &&
        fileName.endsWith(".doc")
      ) {
        return true;
      }

      if (
        normalizedType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        fileName.endsWith(".docx")
      ) {
        return true;
      }

      return false;
    });
  };

  const validateFile = (file: File) => {
    if (file.size > MAX_SIZE) {
      return "Max file size is 5MB";
    }

    if (!matchesAcceptedType(file)) {
      return invalidTypeMessage ?? "Invalid file type";
    }

    return null;
  };

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
        acceptedFileTypes={acceptedFileTypes}
        allowFileTypeValidation={Boolean(acceptedFileTypes?.length)}
        name={name}
        server={{
          process: (fieldName, file, _metadata, load, error, progress) => {
            const validationMessage = validateFile(file as File);

            if (validationMessage) {
              error(validationMessage);
              onUploadError?.(validationMessage);

              return {
                abort: () => { },
              };
            }
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
                onUploadError?.(null);
                onUploadSuccess(imagePath);
                load(String(response.data.id)); // ✅ must be a string
              } else {
                onUploadError?.("Upload failed");
                error("Upload failed");
              }
            };

            xhr.onerror = () => {
              onUploadError?.("Upload failed");
              error("Upload failed");
            };
            xhr.send(formData);

            return {
              abort: () => xhr.abort(),
            };
          },

          // ✅ correct signature: (uniqueFileId, load, error)
          revert: (_uniqueFileId, load) => {
            onUploadError?.(null);
            onRemove?.();
            load(); // required to confirm revert to FilePond
          },
        }}
        onaddfile={(addFileError, fileItem) => {
          if (addFileError) {
            const file = fileItem?.file;
            const validationMessage = file ? validateFile(file as File) : invalidTypeMessage;
            onUploadError?.(validationMessage ?? "Upload failed");
            return;
          }

          const file = fileItem?.file;
          if (!file) {
            return;
          }

          const validationMessage = validateFile(file as File);
          onUploadError?.(validationMessage);
        }}
        onremovefile={() => {
          onUploadError?.(null);
          onRemove?.();
        }}
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
