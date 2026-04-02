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
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

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
      value,
      onChange,
      onBlur,
      name,
    },
    ref
  ) => {
    // Convert string value (e.g. "2021") to Date for DatePicker
    const selectedDate = React.useMemo(() => {
      if (!value) return null;
      const year = parseInt(value, 10);
      if (isNaN(year)) return null;
      return new Date(year, 0, 1);
    }, [value]);

    const handleChange = (date: Date | null) => {
      if (!onChange) return;
      if (date) {
        onChange(date.getFullYear().toString());
      } else {
        onChange("");
      }
    };

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
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none z-10" />
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            showYearPicker
            dateFormat="yyyy"
            disabled={disabled}
            onBlur={onBlur}
            name={name}
            placeholderText={placeholder}
            customInput={
              <Input
                id={id}
                ref={ref}
                aria-invalid={!!error}
                className={cn("pl-10", className)}
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