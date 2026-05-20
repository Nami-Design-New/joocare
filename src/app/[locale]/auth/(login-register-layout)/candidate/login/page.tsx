
import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import SocialLoginButtons from "@/features/auth/components/login-content/SocialLoginButtons";
import FormCandidateLogin from "@/features/auth/components/login-content/FormCandidateLogin";

function LoginFormSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 flex flex-col gap-4">
      <div className="bg-muted h-14 w-full animate-pulse rounded-2xl" />
      <div className="bg-muted h-14 w-full animate-pulse rounded-2xl" />
      <div className="bg-muted h-4 w-32 animate-pulse rounded" />
      <div className="flex justify-center">
        <div className="bg-muted h-11 w-1/3 animate-pulse rounded-full" />
      </div>
    </div>
  );
}

const LoginCandidatePage = async () => {
  const t = await getTranslations();

  return (
    <main className="h-[calc(100vh-75px)] flex items-center justify-center gap-4 ">
      <section
        aria-labelledby="employer-login-page"
        className="w-full md:w-3/4 mx-auto p-4"
      >
        {/* header text */}
        <h1>{t("authPage.pages.candidate-login.title")}</h1>
        <p className="text-[clamp(.8rem,4vw,1rem)] mt-2 mb-8">
          {t("authPage.pages.candidate-login.subtitle")}
        </p>

        {/* Login form */}
        <Suspense fallback={<LoginFormSkeleton />}>
          <FormCandidateLogin />
        </Suspense>

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
            {t("authPage.common.not-member-yet")}{" "}
            <Link
              href="/auth/candidate/register"
              className="text-primary hover:text-primary/60 underline font-medium transition-colors"
            >
              {t("header.join-now")}
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default LoginCandidatePage;
