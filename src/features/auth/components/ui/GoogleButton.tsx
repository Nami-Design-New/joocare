"use client";

// libraries
import Image from "next/image";
import { useTranslations } from "next-intl";

//components
import { Button } from "@/shared/components/ui/button";

const GoogleButton = ({
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
      {t("authPage.social.google")}
      <Image
        src="/assets/icons/google-symbol.svg"
        alt={t("authPage.social.google-icon")}
        width={24}
        height={24}
      />
    </Button>
  );
};

export default GoogleButton;
