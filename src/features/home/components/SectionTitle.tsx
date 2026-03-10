import Image from "next/image";

type SectionTitleProps = {
  sectionTitle: string;
  textColor?: string;
  icon?: string;
};

export default function SectionTitle({
  sectionTitle,
  textColor = "text-secondary",
  icon = "/assets/icons/section-title-icon.svg",
}: SectionTitleProps) {
  return (
    <div className="border-primarySoft bg-soft-overlay flex w-fit items-center gap-2 rounded-lg border px-4 py-2">
      <Image src={icon} width={16} height={16} alt="section title icon" />
      <h3 className={`${textColor} text-md font-normal`}>{sectionTitle}</h3>
    </div>
  );
}
