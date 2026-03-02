// libraries
import Image from "next/image";
// image
import googleIcon from "@/assets/icons/google-symbol.svg";
import linkedInIcon from "@/assets/icons/linkedIn.svg";
//components
import { Button } from "@/shared/components/ui/button";
const SocialButtons = () => {
  return (
    <div className="flex gap-4">
      <Button variant={"outline"} className="w-1/2">
        LinkedIn
        <Image src={linkedInIcon} alt="LinkedIn Icon" width={20} height={20} />
      </Button>
      <Button variant={"outline"} className="w-1/2">
        Google
        <Image src={googleIcon} alt="Google Icon" width={20} height={20} />
      </Button>
    </div>
  );
};

export default SocialButtons;
