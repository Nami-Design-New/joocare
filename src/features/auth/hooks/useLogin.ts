"use client";

import { useRouter } from "@/i18n/navigation";
import { signIn } from "next-auth/react";

export const useLogin = () => {
  const router = useRouter();
  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("LOGIN RESPONSE:", res);

    if (!res?.ok) {
      throw new Error(res?.error || "Login failed");
    }
    router.push("/");
    return res;
  };

  return { login };
};
