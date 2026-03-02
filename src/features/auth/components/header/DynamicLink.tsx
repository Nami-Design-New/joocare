"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/shared/components/ui/button";


const DynamicLink = () => {
  const pathname = usePathname();

  const href = pathname.includes("employer")
    ? "/auth/candidate/login"
    : "/auth/employer/login";

  return (
    <Link
      href={href}
      className={buttonVariants({
        size: "pill",
        variant: "secondary",
      })}
      aria-label="Switch mode"
    >
      {pathname.includes("employer") ? "For Candidate" : "For Employer"}
    </Link>
  );
};

export default DynamicLink;
