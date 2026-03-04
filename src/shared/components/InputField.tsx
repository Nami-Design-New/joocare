"use client";
import * as React from "react";

import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "../lib/utils";

type InputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
} & React.ComponentProps<"input">;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, type = "text", className, error, containerStyles, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("flex flex-col w-full" , containerStyles)}>
        {label && (
          <label htmlFor={id} className="mb-1 font-semibold">
            {label}
          </label>
        )}

        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            className={cn(isPassword && "pr-10", className)}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <span className="text-red-500 text-[12px] mt-1">{error}</span>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
