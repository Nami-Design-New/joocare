"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";

type YearPickerProps = {
  id: string;
  label?: string;
  error?: string | boolean;
  containerStyles?: string;
  hint?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
} & React.ComponentProps<"input">;

export const YearPicker = React.forwardRef<HTMLInputElement, YearPickerProps>(
  (
    {
      id,
      label,
      error,
      containerStyles,
      hint,
      disabled = false,
      placeholder = "ex: 2021",
      className,
      ...props
    },
    ref
  ) => {
    const [date, setDate] = React.useState<Date | null>(null);

    return (
      <div className={cn("flex w-full flex-col", containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}
            {hint && (
              <span className="text-muted-foreground text-sm font-normal">
                {" "}
                {hint}
              </span>
            )}
          </label>
        )}

        <div className="relative w-full flex flex-col">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />

          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            showYearPicker
            dateFormat="yyyy"
            disabled={disabled}
            customInput={
              <Input
                id={id}
                ref={ref}
                placeholder={placeholder}
                className={cn("pl-10", className)}
                {...props}
              />
            }
          />
        </div>

        {error && (
          <span className="mt-1 text-[12px] text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

YearPicker.displayName = "YearPicker";