import Image from 'next/image';
import { useTranslations } from 'next-intl';

type ProfileCvLabelProps = {
  fileName: string;
  canPreview: boolean;
  onPreview: () => void;
};

// File icon, name and "Preview" link inside the profile CV option.
export default function ProfileCvLabel({
  fileName,
  canPreview,
  onPreview,
}: ProfileCvLabelProps) {
  const t = useTranslations('jobDetailsPage.apply.cv');

  return (
    <span className="flex items-center gap-4">
      <Image
        src="/assets/pdf_file.svg"
        alt=""
        width={24}
        height={24}
        className="shrink-0"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <bdi className="truncate font-semibold">{fileName}</bdi>
        <span className="text-muted-foreground text-sm">{t('profile-cv')}</span>
      </span>
      {canPreview ? (
        <button
          type="button"
          onClick={(event) => {
            // Keep the click from also selecting the radio card.
            event.preventDefault();
            onPreview();
          }}
          className="text-assessment-primary shrink-0 px-3 py-2 text-sm font-semibold underline underline-offset-4"
        >
          {t('preview')}
        </button>
      ) : null}
    </span>
  );
}
