
import Link from "next/link";

import SocialLoginButtons from "@/features/auth/components/login-content/SocialLoginButtons";
import FormCandidateLogin from "@/features/auth/components/login-content/FormCandidateLogin";


const LoginCandidatePage = () => {
  return (
    <main className="h-[calc(100vh-75px)] flex items-center justify-center gap-4 ">
      <section
        aria-labelledby="employer-login-page"
        className="w-3/4 mx-auto p-4"
      >
        {/* header text */}
        <h1>Welcome Back</h1>
        <p className="text-[clamp(.8rem,4vw,1rem)]">
          Find your next opportunity faster
        </p>

        {/* Login form */}
        <FormCandidateLogin />

        {/* social buttons */}
        <div
          className="flex items-center gap-3 my-4 text-sm text-gray-500 font-medium 
                before:content-[''] before:flex-1 before:h-px before:bg-gray-200
                after:content-[''] after:flex-1 after:h-px after:bg-gray-200"
        >
          or
        </div>

        <SocialLoginButtons />
        {/* Bottom CTA */}
        <section className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            New to JooCore?{" "}
            <Link
              href="/auth/candidate/register"
              className="text-primary hover:text-primary/60 underline font-medium transition-colors"
            >
              Join Now
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default LoginCandidatePage;
