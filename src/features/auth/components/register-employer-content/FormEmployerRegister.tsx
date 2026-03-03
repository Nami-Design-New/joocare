"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  loginEmployerSchema,
  TLoginEmployerSchema,
} from "../../validation/employer-login-schema";
import { SelectInputField } from "@/shared/components/SelectInputField";
import React from "react";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import Link from "next/link";

type Option = {
  label: string;
  value: string;
};

const FormEmployerRegister = () => {
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<TLoginEmployerSchema>({
  //     resolver: zodResolver(loginEmployerSchema),
  //   });
  //   const onSubmit: SubmitHandler<TLoginEmployerSchema> = (data) =>
  //     console.log(data);
  const [selectedOption, setSelectedOption] = React.useState<
    Option | undefined
  >(undefined);
  const [selectedPhoneCode, setSelectedPhoneCode] = React.useState<
    Option | undefined
  >(undefined);

  return (
    <form
      //   onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <InputField
        id="companyName"
        label="Company Name"
        type={"text"}
        placeholder="ex: JooCore"
        //   {...register("companyName")}
        //   error={errors.companyName?.message}
      />
      <InputField
        id="officialEmail"
        type="email"
        label="Official Email"
        placeholder="ex: mail@mail.com"
        // {...register("officialEmail")}
        // error={errors.officialEmail?.message}
      />
      <SelectInputField
        id="domain"
        label="Domain"
        placeholder="ex: Hospital"
        value={selectedOption}
        onChange={setSelectedOption}
        options={[
          { label: "Hospital", value: "hospital" },
          { label: "Software", value: "software" },
          { label: "Company", value: "company" },
        ]}
      />

      <InputField
        id="personFullName"
        type="text"
        label="Contact person _ full name "
        placeholder="ex: John Doe"
        // {...register("Contact person _ full name ")}
        // error={errors.Contact person _ full name ?.message}
      />

      <>
        {" "}
        <label htmlFor={"phoneCode"} className="-mb-4 font-semibold">
          Contact person _ Phone number
        </label>
        <div className="flex items-center gap-2">
          <SelectInputField
            id="phoneCode"
            label=""
            placeholder="+999"
            value={selectedPhoneCode}
            onChange={setSelectedPhoneCode}
            showPlaceholderImage={true}
            className="min-w-28 w-28"
            options={[
              { label: "+999", value: "+999", image: "/assets/flag.svg" },
              { label: "+24", value: "+24", image: "/assets/logo_1.svg" },
              { label: "+55", value: "+55", image: "/assets/flag.svg" },
            ]}
          />
          <InputField
            id="personFullName"
            type="text"
            label=""
            placeholder="ex:52 987 6543"
            // {...register("Contact person _ full name ")}
            // error={errors.Contact person _ full name ?.message}
          />
        </div>
      </>

      <InputField
        id="createPassword"
        type="password"
        label="Create password"
        placeholder="******"
        // {...register("createPassword")}
        // error={errors.createPassword?.message}
      />
      <LabelCheckbox id="confirmRegister">
        I confirm that I am an employee of the company and that I am authorised
        to use JooCare services on its behalf.
      </LabelCheckbox>

      <LabelCheckbox id="terms">
        I agree to the{" "}
        <span className="underline underline-primary text-secondary">
          Terms & Conditions
        </span>
        and
        <span className="underline underline-primary text-secondary">
          Privacy Policy.
        </span>
      </LabelCheckbox>

      <div className="flex justify-center mt-12">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default FormEmployerRegister;
