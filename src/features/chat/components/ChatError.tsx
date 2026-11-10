'use client';

import { useTranslations } from 'next-intl';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';

type ChatErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ChatError(props: ChatErrorProps) {
  const t = useTranslations('companyPage.chat');
  return (
    <RouteErrorFallback
      {...props}
      title={t('error-title')}
      description={t('error-description')}
      retryLabel={t('retry')}
    />
  );
}
