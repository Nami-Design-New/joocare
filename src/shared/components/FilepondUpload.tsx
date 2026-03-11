"use client";

import { FilePond } from "react-filepond";

import "./filepondPlugins";

// styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

interface FilepondUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  name?: string;
  serverEndpoint?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  error?: string | boolean;
}

export function FilepondUpload({
  files,
  onChange,
  label,
  name = "files",
  allowMultiple = true,
  maxFiles = 3,
  required = false,
  error,
}: FilepondUploadProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <FilePond
        files={files}
        onupdatefiles={(fileItems) => {
          const files = fileItems.map((item) => item.file as File);
          onChange(files);
        }}
        allowImagePreview={false}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        name={name}
        server={"/"}
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
