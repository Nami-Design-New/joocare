import Link from "next/link";
import { getTranslations } from "next-intl/server";

import FormEmployerRegister from "@/features/auth/components/register-employer-content/FormEmployerRegister";

const RegisterEmployerPage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-center gap-4 ">
      <div className="w-full md:w-3/4 mx-auto p-4">
        {/* header text */}
        <h1>{t("authPage.pages.employer-register.title")}</h1>

        {/* Login form */}
        <FormEmployerRegister />

        {/* Bottom CTA */}
        <section className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {t("authPage.common.already-have-account")}{" "}
            <Link
              href="/auth/employer/login"
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

export default RegisterEmployerPage;
