"use client";

import { usePathname } from "next/navigation";

import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/i18n/navigation";

const DynamicLink = () => {
  const pathname = usePathname();

  const href = pathname.includes("employer")
    ? "/auth/candidate/login"
    : "/auth/employer/login";

  return (
    <Link
      prefetch
      href={href}
      className={buttonVariants({
        size: "pill",
        variant: "secondary",
      })}
      aria-label="Switch mode"
    >
      {pathname.includes("employer") ? "For Candidate" : "For Employer"}
    </LinK>
  );
};

export default DynamicLink;
