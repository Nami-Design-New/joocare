// libraries
import Link from "next/link";
import HeaderLoginContent from "../../../components/login-content/HeaderLoginContent";
import FormEmployerLogin from "../../../components/login-content/FormEmployerLogin";
import SocialLoginButtons from "../../../components/login-content/SocialLoginButtons";
import { Section } from "lucide-react";

//components


const LoginEmployerPage = () => {
  return (
    <main className="h-[calc(100vh-75px)] flex items-center justify-center gap-4 ">
      <section
       aria-labelledby="employer-login-page"
       className="w-3/4 mx-auto p-4">
        {/* header text */}
        <HeaderLoginContent />

        {/* Login form */}
        <FormEmployerLogin />

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
        <Section  className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            New to JooCore?{" "}
            <Link
              href="#"
              className="text-secondary hover:text-secondary/60 underline font-medium transition-colors"
            >
              Join Now
            </Link>
          </p>
        </Section>
      </section>
    </main>
  );
};

export default LoginEmployerPage;
