"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const SideContent = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const isEmployerLogin = pathname.includes("employer/login");
  const isCandidateLogin = pathname.includes("candidate/login");

  const isEmployerRegister = pathname.includes("employer/register");
  const isCandidateRegister = pathname.includes("candidate/register");

  return (
    <aside
      aria-labelledby="auth-heading"
      className="sticky top-19 hidden h-[calc(100vh-76px)] items-center gap-4 bg-[linear-gradient(42.95deg,#1C2628,#00694B)] md:flex"
    >
      <div className="mx-auto w-5/6 p-4 text-white">
        {isEmployerRegister ? (
          <>
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white mb-12">
              {t("authPage.side-content.employer-register.title")}
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
              {t("authPage.side-content.default.title-line-1")}
            </h2>
            <h3 className="mb-12 text-[clamp(1.5rem,4vw,3rem)] font-bold">
              {t("authPage.side-content.default.title-line-2")}
            </h3>
          </>
        )}

        <p className="text-justify text-[clamp(.8rem,4vw,1.2rem)] [word-spacing:0.1rem]">
          {isEmployerLogin &&
            t("authPage.side-content.employer-login.description")}
          {isCandidateLogin &&
            t("authPage.side-content.candidate-login.description")}
          {isEmployerRegister &&
            t("authPage.side-content.employer-register.description")}
          {isCandidateRegister &&
            t("authPage.side-content.candidate-register.description")}
        </p>
      </div>
    </aside>
  );
};

export default SideContent;
