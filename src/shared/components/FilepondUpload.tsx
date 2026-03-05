"use client";

import React from "react";
import { FilePond } from "react-filepond";

import "./filepondPlugins";

// styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

interface FilepondUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  name?: string;
  serverEndpoint?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  required?: boolean;
}

export function FilepondUpload({
  files,
  onChange,
  label,
  name = "files",
  allowMultiple = true,
  maxFiles = 3,
  required = false,
}: FilepondUploadProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

<FilePond
  files={files}
  onupdatefiles={(fileItems) => {
    const files = fileItems.map((item) => item.file);
    onChange(files);
  }}
  allowImagePreview={false}
  allowMultiple={allowMultiple}
  maxFiles={maxFiles}
  name={name}
  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
/>

    </div>
  );
}