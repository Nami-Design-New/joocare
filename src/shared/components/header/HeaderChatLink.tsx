'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '../ui/button';

export default function HeaderChatLink() {
  const t = useTranslations('header');
  return (
    <Button asChild className="h-8 rounded-full px-2 md:h-10 md:px-4">
      <Link href="/company/chat" aria-label={t('message')}>
        <Image
          src="/assets/chat/chat.png"
          width={20}
          height={20}
          alt=""
          unoptimized
        />
        <span className="hidden md:inline">{t('message')}</span>
      </Link>
    </Button>
  );
}
