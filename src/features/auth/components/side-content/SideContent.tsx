"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const SideContent = () => {
  const pathname = usePathname();
  const t = useTranslations("AuthSideContent");
  const isEmployerLogin = pathname.includes("employer/login");
  const isCandidateLogin = pathname.includes("candidate/login");
  const isEmployerRegister = pathname.includes("employer/register");
  const isCandidateRegister = pathname.includes("candidate/register");

  return (
    <aside
      aria-labelledby="auth-heading"
      className="sticky top-21.5 hidden h-[calc(100vh-86px)] items-center gap-4 bg-[linear-gradient(42.95deg,#1C2628,#00694B)] md:flex"
    >
      <div className="mx-auto w-5/6 p-4 text-white">
        {isEmployerRegister ? (
          <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
            {t("employerRegisterTitle")}
          </h2>
        ) : (
          <>
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
              {t("candidateTitlePrimary")}
            </h2>
            <h3 className="mb-4 text-[clamp(1.5rem,4vw,3rem)] font-bold">
              {t("candidateTitleSecondary")}
            </h3>
          </>
        )}

        <p className="text-justify text-[clamp(.8rem,4vw,1.2rem)] [word-spacing:0.1rem]">
          {(isEmployerLogin || isCandidateLogin) && t("candidateLoginDescription")}
          {isEmployerRegister && t("employerDescription")}
          {isCandidateRegister && t("candidateRegisterDescription")}
        </p>
      </div>
    </aside>
  );
};

export default SideContent;
