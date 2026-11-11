import Image from 'next/image';

type SectionTitleProps = {
  sectionTitle: string;
  textColor?: string;
  icon?: string;
};

export default function SectionTitle({
  sectionTitle,
  textColor = 'text-secondary',
  icon = '/assets/icons/section-title-icon.svg',
}: SectionTitleProps) {
  return (
    <div className="border-primarySoft flex w-fit items-center gap-2 rounded-lg border bg-soft-overlay px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <Image src={icon} width={16} height={16} alt="section title icon" />
      <h3 className={`${textColor} text-sm font-normal whitespace-nowrap`}>
        {sectionTitle}
      </h3>
    </div>
  );
}
