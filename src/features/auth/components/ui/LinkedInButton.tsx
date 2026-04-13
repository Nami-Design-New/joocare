// libraries
import Image from "next/image";

//components
import { Button } from "@/shared/components/ui/button";

const LinkedInButton = ({
  onClick,
}: {
  onClick?: () => void | Promise<void>;
}) => {
  return (
    <Button
      variant={"outline"}
      size={"xl"}
      className="w-1/2 gap-2 text-lg border-border"
      type="button"
      onClick={onClick}
    >
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
