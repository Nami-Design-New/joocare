// libraries
import Image from "next/image";

//components
import { Button } from "@/shared/components/ui/button";

const GoogleButton = () => {
  return (
    <Button variant={"outline"} size={"xl"} className="w-1/2 gap-2 text-lg border-border">
      Google
      <Image
        src="/assets/icons/google-symbol.svg"
        alt="Google Icon"
        width={24}
        height={24}
      />
    </Button>
  );
};

export default GoogleButton;
