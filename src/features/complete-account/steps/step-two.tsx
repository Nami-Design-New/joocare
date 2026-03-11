// "use client";

// import { useFormContext } from "react-hook-form";
// import { Input } from "@/shared/components/ui/input";
// import { Label } from "@/shared/components/ui/label";

// export default function StepTwo() {
//   const { register } = useFormContext();

//   return (
//     <div className="space-y-4">

//       <div>
//         <Label>Email</Label>
//         <Input {...register("email")} />
//       </div>

//       <div>
//         <Label>Phone</Label>
//         <Input {...register("phone")} />
//       </div>

//     </div>
//   );
// }

"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Controller, useFormContext } from "react-hook-form";

export default function StepTwo() {
  const { register, control, formState: { errors }, } = useFormContext();

  return (
    <div className="flex flex-col gap-y-5">
      <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
        <h2 className="text-lg text-disabled font-semibold text-start mt-2">
          Commercial Registration
        </h2>
        <InputField
          id="commercialRegister"
          label="Commercial Registration No"
          type={"text"}
          placeholder="ex: 23121212"
          className="bg-white"
          {...register("commercialRegister")}
          error={errors.commercialRegister?.message?.toString()}
        />

        <div className="flex justify-center items-center gap-2">
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="domain"
                label="Domain"
                placeholder="ex: Hospital"
                className="bg-white"
                value={
                  field.value ? { label: field.value, value: field.value } : null
                }
                onChange={(option) => field.onChange(option?.value)}
                error={errors.domain?.message?.toString()}
                options={[
                  { label: "Hospital", value: "hospital" },
                  { label: "Software", value: "software" },
                  { label: "Company", value: "company" },
                ]}
              />
            )}
          />
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="domain"
                label="Domain"
                placeholder="ex: Hospital"
                className="bg-white"
                value={
                  field.value ? { label: field.value, value: field.value } : null
                }
                onChange={(option) => field.onChange(option?.value)}
                error={errors.domain?.message?.toString()}
                options={[
                  { label: "Hospital", value: "hospital" },
                  { label: "Software", value: "software" },
                  { label: "Company", value: "company" },
                ]}
              />
            )}
          />
        </div>
      </div>

      
    </div>
  );
}