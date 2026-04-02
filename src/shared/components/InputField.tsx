"use client";
import * as React from "react";

import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "../lib/utils";

type InputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  disable?: boolean;
  hint?: string;
  icon?: React.ReactNode
} & React.ComponentProps<"input">;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      type = "text",
      className,
      error,
      containerStyles,
      disabled = false,
      hint,
      icon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("flex w-full flex-col", containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}{" "}
            {hint && (
              <span className="text-muted-foreground text-sm font-normal">
                {" "}
                {hint}{" "}
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(isPassword && "pr-10", className)}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          )}
          {icon && <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {icon}
          </div>}
        </div>

        {error && (
          <span className="mt-1 text-[12px] text-red-500">{error}</span>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
