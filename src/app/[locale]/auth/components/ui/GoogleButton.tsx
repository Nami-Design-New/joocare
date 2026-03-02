// libraries
import Image from "next/image";

//components
import { Button } from "@/shared/components/ui/button";

const GoogleButton = () => {
  return (
    <Button variant={"outline"} className="w-1/2 gap-2">
      Google
      <Image
        src="/assets/icons/google-symbol.svg"
        alt="Google Icon"
        width={20}
        height={20}
      />
    </Button>
  );
};

export default GoogleButton;
