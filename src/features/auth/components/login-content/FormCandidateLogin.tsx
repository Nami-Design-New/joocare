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
import { useLogin } from "../../hooks/useLogin";

const FormCandidateLogin = () => {
  const { login } = useLogin("candidate");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginCandidateSchema>({
    resolver: zodResolver(loginCandidateSchema),
  });

  const onSubmit: SubmitHandler<TLoginCandidateSchema> = async (data) => {
    try {
      await login(data.email, data.password);
    } catch {
      // Toast feedback is handled in the login hook.
    }
  };

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
      <Link href="/auth/candidate/forget-password" className="text-xs hover:text-primary">
        Forgot password?
      </Link>
      <div className="flex justify-center">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default FormCandidateLogin;
