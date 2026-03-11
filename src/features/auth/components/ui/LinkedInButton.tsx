// libraries
import Image from "next/image";

//components
import { Button } from "@/shared/components/ui/button";

const LinkedInButton = () => {
  return (
    <Button variant={"outline"} size={"xl"} className="w-1/2 gap-2 text-lg border-border">
      LinkedIn
      <Image
        src="/assets/icons/linkedIn.svg"
        alt="LinkedIn Icon"
        width={24}
        height={24}
      />
    </Button>
  );
};

export default LinkedInButton;
