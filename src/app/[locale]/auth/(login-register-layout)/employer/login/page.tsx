// libraries
import FormEmployerLogin from "@/features/auth/components/login-content/FormEmployerLogin";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

//components

const LoginEmployerPage = async () => {
  const t = await getTranslations();

  return (
    <div className="h-[calc(100vh-75px)] flex items-center justify-center gap-4 ">
      <div className="w-full md:w-3/4  mx-auto p-4">
        {/* header text */}
        <h1>
          {t("authPage.pages.employer-login.title-line-1")}
          <br /> {t("authPage.pages.employer-login.title-line-2")}
        </h1>
        <p className="text-[clamp(.8rem,4vw,1rem)] mt-1">
          {t("authPage.pages.employer-login.subtitle")}
        </p>

        {/* Login form */}
        <FormEmployerLogin />

        {/* <div
          className="flex items-center gap-3 my-4 text-sm text-gray-500 font-medium 
          before:content-[''] before:flex-1 before:h-px before:bg-gray-200
          after:content-[''] after:flex-1 after:h-px after:bg-gray-200"
        >
          or
        </div>
        <SocialLoginButtons role="employer" /> */}

        {/* Bottom CTA */}
        <section className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {t("authPage.common.not-member-yet")}{" "}
            <Link
              href="/auth/employer/register"
              className="text-primary hover:text-primary/60 underline font-medium transition-colors"
            >
              {t("header.join-now")}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginEmployerPage;
