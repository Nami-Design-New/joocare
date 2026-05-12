import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";

type SectionTitleProps = {
  sectionTitle: string;
  translationKey?: string;
  textColor?: string;
  icon?: string;
};

export default function SectionTitle({
  sectionTitle,
  translationKey,
  textColor = "text-secondary",
  icon = "/assets/icons/section-title-icon.svg",
}: SectionTitleProps) {
  const t = useTranslations("SectionTitles");
  const messages = useMessages() as Record<string, unknown>;
  const sectionTitleMessages =
    (messages.SectionTitles as Record<string, unknown> | undefined) ?? {};
  const resolvedTitle =
    translationKey && translationKey in sectionTitleMessages
      ? t(translationKey)
      : sectionTitle;

  return (
    <div className="border-primarySoft bg-soft-overlay flex w-fit items-center gap-2 rounded-lg border px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <Image src={icon} width={16} height={16} alt="section title icon" />
      <h3 className={`${textColor} text-sm font-normal`}>{resolvedTitle}</h3>
    </div>
  );
}
