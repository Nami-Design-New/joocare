"use client"

import Image from "next/image";

import { LanguageToggle } from "@/shared/components/LanguageToggle";
import DynamicLink from "./DynamicLink";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

const AuthHeader = () => {
  const pathname = usePathname();
  const hiddenDynamicLink = pathname.includes("password");

  return (
    <header className="sticky top-0 bg-white px-[clamp(.1rem,2vw,3rem)] py-4 w-full shadow-header z-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" aria-label="Homepage">
          <Image
            src="/assets/logo_1.svg"
            alt="Joocare Logo"
            width={100}
            height={40}
            priority
          />
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          {!hiddenDynamicLink && <DynamicLink />}

          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader;
