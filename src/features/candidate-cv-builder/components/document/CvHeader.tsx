import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import type { CandidateCvContact } from '../../types/cv-document.types';

type CvHeaderProps = {
  name: string;
  photo?: string;
  jobTitle: string;
  contact: CandidateCvContact;
};

export default function CvHeader({
  name,
  photo,
  jobTitle,
  contact,
}: CvHeaderProps) {
  const contactItems = [
    { icon: Phone, value: contact.phone, isLtr: true },
    { icon: Mail, value: contact.email, isLtr: true },
    { icon: MapPin, value: contact.location, isLtr: false },
    { icon: Linkedin, value: contact.linkedin, isLtr: true },
  ].filter((item) => item.value);

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        {photo && (
          <Image
            src={photo}
            alt={name}
            width={120}
            height={120}
            unoptimized
            className="size-24 shrink-0 rounded-full object-cover sm:size-30"
          />
        )}
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 className="text-foreground text-[32px] leading-tight font-bold sm:text-[38px]">
            {name}
          </h2>
          <p className="text-primary text-xl font-medium sm:text-[22px]">
            {jobTitle}
          </p>
        </div>
      </div>

      <ul className="border-border flex shrink-0 flex-col gap-3 sm:border-s sm:ps-5">
        {contactItems.map(({ icon: Icon, value, isLtr }) => (
          <li
            key={value}
            className="text-secondary flex items-center gap-3 text-[15px] leading-5"
          >
            <Icon
              aria-hidden="true"
              className="size-5 shrink-0"
              strokeWidth={1.5}
            />
            <span dir={isLtr ? 'ltr' : undefined}>{value}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
