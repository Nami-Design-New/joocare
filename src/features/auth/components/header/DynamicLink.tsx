"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/i18n/navigation";

const DynamicLink = () => {
  const pathname = usePathname();

  const isEmployer = pathname.includes("employer");
  const isLogin = pathname.includes("login");

  const href = isLogin
    ? isEmployer
      ? "/auth/candidate/login"
      : "/auth/employer/login"
    : isEmployer
    ? "/auth/candidate/register"
    : "/auth/employer/register";

  return (
    <Link
      href={href}
      className={buttonVariants({
        size: "pill",
        variant: "secondary",
      })}
      aria-label="Switch mode"
    >
      {isEmployer ? "For Candidate" : "For Employer"}
    </Link>
  );
};

export default DynamicLink;