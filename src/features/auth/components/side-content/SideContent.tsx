"use client";

import { usePathname } from "next/navigation";

const SideContent = () => {
  const pathname = usePathname();
  const isEmployerLogin = pathname.includes("employer/login");
  const isCandidateLogin = pathname.includes("candidate/login");

  const isEmployerRegister = pathname.includes("employer/register");
  const isCandidateRegister = pathname.includes("candidate/register");

  return (
    <aside
      aria-labelledby="auth-heading"
      className="hidden md:flex sticky top-[86px] h-[calc(100vh-86px)] 
      bg-[linear-gradient(45deg,#0A3463,#6CABEC)] items-center gap-4"
    >
      <div className="w-5/6 mx-auto p-4 text-white">
        {isEmployerRegister ? (
          <>
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
              Let’s setup your operating Agreement
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
              Match Faster
            </h2>
            <h3 className="text-[clamp(1.5rem,4vw,3rem)] font-bold mb-4">
              work smarter
            </h3>
          </>
        )}

        <p className="text-[clamp(.8rem,4vw,1.2rem)] [word-spacing:0.1rem] text-justify">
          {(isEmployerLogin || isCandidateLogin) &&
            `
          With smart tools and AI-powered insights, joocare helps you find the
          right opportunity and land the job you deserve with confidence.
            `}
          {isEmployerRegister &&
            `
            With smart tools and AI-powered insights, joocare helps you find the right opportunity and land the job you deserve with confidence.`}
          {isCandidateRegister &&
            `With smart tools and AI-powered insights, joocare helps you to find the right opportunity and land the job you deserve with confidence." to "Joocare leverages AI-driven tools and insights to connect you with opportunities that match your skills and career goals, empowering you to succeed with confidence.`}
        </p>
      </div>
    </aside>
  );
};

export default SideContent;
