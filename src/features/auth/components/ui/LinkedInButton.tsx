"use client";

// libraries
import Image from "next/image";
import { useTranslations } from "next-intl";

//components
import { Button } from "@/shared/components/ui/button";

const LinkedInButton = ({
  onClick,
}: {
  onClick?: () => void | Promise<void>;
}) => {
  const t = useTranslations();

  return (
    <Button
      variant={"outline"}
      size={"xl"}
      className="w-1/2 gap-2 text-lg border-border"
      type="button"
      onClick={onClick}
    >
      {t("authPage.social.linkedin")}
      <Image
        src="/assets/icons/linkedIn.svg"
        alt={t("authPage.social.linkedin-icon")}
        width={24}
        height={24}
      />
    </Button>
  );
};

export default LinkedInButton;
