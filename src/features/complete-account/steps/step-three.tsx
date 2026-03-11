"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function StepThree() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          {...register("password")}
        />
      </div>

    </div>
  );
}