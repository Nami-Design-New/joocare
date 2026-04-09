"use client";

import { useMemo } from "react";
import { FileOrigin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import "./filepondPlugins";

type StoredFilepondUploadProps = {
  files?: File[];
  onChange?: (files: File[]) => void;
  label?: string;
  hint?: string;
  name?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  allowImagePreview?: boolean;
  className?: string;
  error?: string;
  acceptedFileTypes?: string[];
  processFile?: (file: File) => Promise<{ path: string }>;
  onStoredPathChange?: (path: string | null) => void;
  onUploadError?: (message: string | null) => void;
  existingFileUrl?: string | null;
  existingFileLabel?: string | null;
  onExistingFileRemove?: () => void;
};

function getFileName(url: string, fallback = "Uploaded file") {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? fallback);
  } catch {
    return decodeURIComponent(url.split("/").filter(Boolean).pop() ?? fallback);
  }
}

function getFileTypeFromName(fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".pdf")) {
    return "application/pdf";
  }

  if (lowerName.endsWith(".doc")) {
    return "application/msword";
  }

  if (lowerName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (lowerName.endsWith(".png")) {
    return "image/png";
  }

  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  return "application/octet-stream";
}

export function StoredFilepondUpload({
  files = [],
  onChange,
  label,
  hint,
  name = "files",
  allowMultiple = false,
  maxFiles = 1,
  required = false,
  allowImagePreview = false,
  className,
  error,
  acceptedFileTypes,
  processFile,
  onStoredPathChange,
  onUploadError,
  existingFileUrl,
  existingFileLabel,
  onExistingFileRemove,
}: StoredFilepondUploadProps) {
  const hasLocalFiles = files.length > 0;
  const shouldShowExistingFile = !hasLocalFiles && Boolean(existingFileUrl);

  const pondFiles = useMemo(() => {
    if (hasLocalFiles) {
      return files;
    }

    if (!existingFileUrl) {
      return [];
    }

    const fileName = existingFileLabel || getFileName(existingFileUrl);

    return [
      {
        source: existingFileUrl,
        options: {
          type: "local" as const,
          file: {
            name: fileName,
            size: 0,
            type: getFileTypeFromName(fileName),
          },
        },
      },
    ];
  }, [existingFileLabel, existingFileUrl, files, hasLocalFiles]);

  return (
    <div className={`w-full space-y-2 ${className ?? ""}`}>
      {label ? (
        <label className="block text-sm font-medium">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
          {hint ? (
            <span className="text-muted-foreground text-sm font-normal">
              {" "}
              {hint}
              {" "}
            </span>
          ) : null}
        </label>
      ) : null}

      <FilePond
        id={error ? "filepond-error" : ""}
        files={pondFiles}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        allowImagePreview={allowImagePreview}
        acceptedFileTypes={acceptedFileTypes}
        allowFileTypeValidation={Boolean(acceptedFileTypes?.length)}
        name={name}
        server={{
          process: processFile
            ? async (_fieldName, file, _metadata, load, serverError, progress) => {
              try {
                progress(true, 0, 1);

                const selectedFile =
                  file instanceof File
                    ? file
                    : new File([file], file.name, { type: file.type });

                const result = await processFile(selectedFile);
                onStoredPathChange?.(result.path);
                onUploadError?.(null);
                progress(true, 1, 1);
                load(result.path);
              } catch (uploadError) {
                const message =
                  uploadError instanceof Error
                    ? uploadError.message
                    : "Failed to upload file.";
                onUploadError?.(message);
                serverError(message);
              }
            }
            : undefined,
          load: shouldShowExistingFile
            ? async (_source, load, serverError) => {
              try {
                const response = await fetch(existingFileUrl!);

                if (!response.ok) {
                  throw new Error("Failed to load file.");
                }

                const blob = await response.blob();
                load(blob);
              } catch (loadError) {
                const message =
                  loadError instanceof Error
                    ? loadError.message
                    : "Failed to load file.";
                serverError(message);
              }
            }
            : undefined,
          revert: (_uniqueFileId, load) => {
            onStoredPathChange?.(null);
            load();
          },
        }}
        onupdatefiles={(fileItems) => {
          const nextFiles = fileItems
            .map((fileItem) => fileItem.file)
            .filter((file): file is File => file instanceof File);

          onChange?.(nextFiles);

          if (nextFiles.length > 0) {
            onUploadError?.(null);
          }
        }}
        onremovefile={(_error, fileItem) => {
          if (fileItem?.origin === FileOrigin.LOCAL) {
            onExistingFileRemove?.();
            return;
          }

          onStoredPathChange?.(null);
        }}
        labelIdle={`
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <img src="/assets/icons/Group.svg" alt="upload icon" width="20" height="20"/>
            <span style="font-size:14px;">Drag & Drop your files or Browse</span>
          </div>
        `}
      />

      {error ? <span className="mt-1 text-[12px] text-red-500">{error}</span> : null}
    </div>
  );
}
