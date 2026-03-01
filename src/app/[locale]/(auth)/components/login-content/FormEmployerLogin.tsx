"use client";

// libraries
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
//components
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  loginEmployerSchema,
  TLoginEmployerSchema,
} from "../../validation/employer-login-schema";

const FormEmployerLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginEmployerSchema>({
    resolver: zodResolver(loginEmployerSchema),
  });
  const onSubmit: SubmitHandler<TLoginEmployerSchema> = (data) =>
    console.log(data);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <div>
        <InputField
          id="email"
          label="Email"
          type={"email"}
          placeholder="ex:mail@mail.com"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>
      <InputField
        id="password"
        type="password"
        label="Password"
        placeholder="******"
        {...register("password")}
        error={errors.password?.message}
      />
      <Link href="/forget-password" className="text-xs hover:text-primary">
        Forgot password?
      </Link>
      <div className="flex justify-center">
        <Button
          variant={"secondary"}
          hoverStyle={"slide"}
          className="w-1/3"
          type="submit"
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default FormEmployerLogin;
