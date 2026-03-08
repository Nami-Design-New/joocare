"use client";

// libraries
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
//components
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  loginCandidateSchema,
  TLoginCandidateSchema,
} from "../../validation/candidate-login-schema";

const FormCandidateLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginCandidateSchema>({
    resolver: zodResolver(loginCandidateSchema),
  });
  const onSubmit: SubmitHandler<TLoginCandidateSchema> = (data) =>
    console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <InputField
        id="email"
        label="Email"
        type={"email"}
        placeholder="ex: mail@mail.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <InputField
        id="password"
        type="password"
        label="Password"
        placeholder="******"
        {...register("password")}
        error={errors.password?.message}
      />
      <Link href="/reset-password/forget-password" className="text-xs hover:text-primary">
        Forgot password?
      </Link>
      <div className="flex justify-center">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default FormCandidateLogin;
