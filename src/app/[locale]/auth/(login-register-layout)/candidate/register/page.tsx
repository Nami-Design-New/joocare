import Link from "next/link";
import { getTranslations } from "next-intl/server";

import FormCandidateRegister from "@/features/auth/components/register-employer-content/FormCandidateRegister";
import SocialLoginButtons from "@/features/auth/components/login-content/SocialLoginButtons";

const RegisterCandidatePage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-center gap-4 ">
      <div className="w-full md:w-3/4 mx-auto p-4">
        {/* header text */}
        <h1>{t("authPage.pages.candidate-register.title")}</h1>

        {/* Login form */}
        <FormCandidateRegister />

        {/* social buttons */}
        <div
          className="flex items-center gap-3 my-4 text-sm text-gray-500 font-medium 
                before:content-[''] before:flex-1 before:h-px before:bg-gray-200
                after:content-[''] after:flex-1 after:h-px after:bg-gray-200"
        >
          {t("authPage.common.or")}
        </div>

        <SocialLoginButtons role="candidate" />

        {/* Bottom CTA */}
        <section className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {t("authPage.common.already-have-account")}{" "}
            <Link
              href="/auth/candidate/login"
              className="text-primary hover:text-primary/60 underline font-medium transition-colors"
            >
              {t("authPage.common.sign-in")}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RegisterCandidatePage;
