import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type ProfileAvatarProps = {
  image: string;
  alt: string;
  isVerified: boolean;
};

// Profile photo inside a halo + gradient ring, with the online dot and the "Verified" badge.
export default function ProfileAvatar({
  image,
  alt,
  isVerified,
}: ProfileAvatarProps) {
  const t = useTranslations('candidatePage.profile');

  return (
    <div className="relative h-50 w-46">
      <div className="size-46 rounded-full bg-profile-accent/12 p-1">
        <div className="size-full rounded-full bg-card p-1">
          <div className="size-full rounded-full bg-linear-to-br from-profile-accent to-assessment-primary p-1">
            <div className="size-full rounded-full bg-card p-1">
              <Image
                src={image}
                alt={alt}
                width={152}
                height={152}
                className="size-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <span
        aria-hidden
        className="absolute end-6 top-33 size-5.5 rounded-full border-4 border-white bg-profile-online shadow-[0_2px_6px_oklch(0_0_0/12%)]"
      />
      {isVerified ? (
        <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-white bg-profile-verified py-1.5 ps-3.5 pe-4 text-sm font-semibold whitespace-nowrap text-assessment-primary">
          <CircleCheck aria-hidden className="size-4.5" strokeWidth={1.5} />
          {t('verified')}
        </span>
      ) : null}
    </div>
  );
}
