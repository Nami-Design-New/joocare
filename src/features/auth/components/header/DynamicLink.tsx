"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/i18n/navigation";

const DynamicLink = () => {
  const pathname = usePathname();
  const t = useTranslations();

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
      aria-label={t("authPage.header.switch-mode-aria")}
    >
      {isEmployer ? t("authPage.common.for-candidate") : t("header.for-employer")}
    </Link>
  );
};

export default DynamicLink;
