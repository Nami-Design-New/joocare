import {
  BriefcaseBusiness,
  CalendarDays,
  Car,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Mail,
  MapPin,
  Phone,
  Ribbon,
  VenusAndMars,
} from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type {
  CandidateProfessionalProfile,
  CandidateProfileViewModel,
} from '../../types/profile.types';
import { PROFILE_INFO_ICONS } from '../../constants';
import ProfileInfoRow from './ProfileInfoRow';

type ProfileInfoListProps = {
  profile: CandidateProfileViewModel | null;
  professional: CandidateProfessionalProfile;
};

type InfoRow = {
  key: string;
  icon: ReactNode;
  label: string;
  value?: string | null;
};

const ICON_STROKE = 1.5;

// Contact, professional and personal details list of the profile side panel.
export default function ProfileInfoList({
  profile,
  professional,
}: ProfileInfoListProps) {
  const t = useTranslations('candidatePage.profile');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const list = (items?: string[]) =>
    items?.length ? new Intl.ListFormat(locale).format(items) : null;
  const drivingLicense =
    profile?.drivingLicense === undefined || profile.drivingLicense === null
      ? null
      : tCommon(profile.drivingLicense ? 'yes' : 'no');

  const rows: InfoRow[] = [
    {
      key: 'email',
      icon: <Mail strokeWidth={ICON_STROKE} />,
      label: t('email'),
      value: profile?.email,
    },
    {
      key: 'location',
      icon: <MapPin strokeWidth={ICON_STROKE} />,
      label: t('location'),
      value: profile?.location,
    },
    {
      key: 'phone',
      icon: <Phone strokeWidth={ICON_STROKE} />,
      label: t('phone'),
      value: profile?.fullPhone,
    },
    {
      key: 'experience',
      icon: <BriefcaseBusiness strokeWidth={ICON_STROKE} />,
      label: t('experience'),
      value: profile?.experience,
    },
    {
      key: 'specialty',
      icon: <GraduationCap strokeWidth={ICON_STROKE} />,
      label: t('specialty'),
      value: professional.specialty,
    },
    {
      key: 'subspecialty',
      icon: <GraduationCap strokeWidth={ICON_STROKE} />,
      label: t('subspecialty'),
      value: professional.subspecialty,
    },
    {
      key: 'domain',
      icon: (
        <Image src={PROFILE_INFO_ICONS.domain} alt="" width={20} height={20} />
      ),
      label: t('domain'),
      value: professional.domain,
    },
    {
      key: 'category',
      icon: <Ribbon strokeWidth={ICON_STROKE} />,
      label: t('category'),
      value: professional.category,
    },
    {
      key: 'age',
      icon: <CalendarDays strokeWidth={ICON_STROKE} />,
      label: t('age'),
      value: profile?.age ? String(profile.age) : null,
    },
    {
      key: 'gender',
      icon: <VenusAndMars strokeWidth={ICON_STROKE} />,
      label: t('gender'),
      value: profile?.gender,
    },
    {
      key: 'religion',
      icon: (
        <Image
          src={PROFILE_INFO_ICONS.religion}
          alt=""
          width={20}
          height={20}
        />
      ),
      label: t('religion'),
      value: profile?.religion,
    },
    {
      key: 'marital-status',
      icon: <Heart strokeWidth={ICON_STROKE} />,
      label: t('marital-status'),
      value: profile?.maritalStatus,
    },
    {
      key: 'languages',
      icon: <Languages strokeWidth={ICON_STROKE} />,
      label: t('languages-known'),
      value: list(profile?.languages),
    },
    {
      key: 'driving-license',
      icon: <Car strokeWidth={ICON_STROKE} />,
      label: t('driving-license'),
      value: drivingLicense,
    },
    {
      key: 'issuing-countries',
      icon: <Globe strokeWidth={ICON_STROKE} />,
      label: t('issuing-countries'),
      value: list(profile?.licenseCountries),
    },
  ];

  return (
    <ul className="flex flex-col">
      {rows.map((row) => (
        <ProfileInfoRow
          key={row.key}
          icon={row.icon}
          label={row.label}
          value={row.value || '-'}
        />
      ))}
    </ul>
  );
}
