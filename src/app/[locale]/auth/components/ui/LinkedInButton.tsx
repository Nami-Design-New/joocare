// libraries
import Image from "next/image";

//components
import { Button } from "@/shared/components/ui/button";

const LinkedInButton = () => {
  return (
    <Button variant={"outline"} className="w-1/2 gap-2">
      LinkedIn
      <Image
        src="/assets/icons/linkedIn.svg"
        alt="LinkedIn Icon"
        width={20}
        height={20}
      />
    </Button>
  );
};

export default LinkedInButton;
