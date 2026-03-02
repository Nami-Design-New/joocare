// libraries
import Image from "next/image";

// assets
import logoImage from "@/assets/logo_1.svg";

// components
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { Button } from "@/shared/components/ui/button";

const AuthHeader = () => {
  return (
    <header className="px-[clamp(.2rem,5vw,3rem)] mx-auto  py-4 flex justify-between items-center shadow-lg bg-white">
      <Image src={logoImage} alt="Logo" width={100} height={40} />
      <div className="flex items-center gap-4 md:gap-4">
        <Button size="pill" variant="secondary">
          For Candidate
        </Button>
        <LanguageToggle />
      </div>
    </header>
  );
};

export default AuthHeader;
