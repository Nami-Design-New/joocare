// libraries
import Image from "next/image";
import Link from "next/link";

// components
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import DynamicLink from "./DynamicLink";

const AuthHeader = () => {
  return (
    <header className="px-[clamp(.2rem,5vw,3rem)] mx-auto  py-4 flex justify-between items-center shadow-lg bg-white">
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
        <DynamicLink />

        <LanguageToggle />
      </nav>
    </header>
  );
};

export default AuthHeader;
