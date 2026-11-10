'use client';

import { Briefcase, LogOut, Send, User, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLogout } from '@/features/auth/hooks/useLogout';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { cn } from '@/shared/lib/utils';
import type { SharedReviewSummary } from '../../types/shared-review.types';

const EMPLOYER_LANDING_HREF = '/for-employers';
const HIRING_MANAGER_START_HREF = '/hiring-manager/create-password';

type DecisionsSubmittedModalProps = {
  projectName: string;
  recruiter: string;
  summary: SharedReviewSummary;
  experience?: 'company' | 'hiring-manager';
};

export default function DecisionsSubmittedModal({
  projectName,
  recruiter,
  summary,
  experience = 'company',
}: DecisionsSubmittedModalProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const { logout } = useLogout();
  const stats = [
    {
      icon: Users,
      value: summary.shortlisted,
      label: t('candidates-shortlisted'),
      iconClass: 'bg-primary-bg text-primary',
    },
    {
      icon: X,
      value: summary.rejected,
      label: t('candidates-rejected'),
      iconClass: 'bg-destructive/10 text-destructive',
    },
    {
      icon: User,
      value: recruiter,
      label: t('submitted-to-recruiter'),
      iconClass: 'bg-assessment-link-info text-assessment-link-info-text',
    },
  ];

  return (
    <SuccessModal
      open
      onOpenChange={() => undefined}
      variant="submitted"
      title={t('success-title')}
      description={t.rich('success-description', {
        project: projectName,
        strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
      })}
      className="w-[calc(100%-2rem)] max-w-175 rounded-3xl sm:max-w-175"
      visualWrapperClassName="mt-0 mb-4"
      primaryAction={{
        label: t('log-out'),
        icon: <LogOut className="size-5 rtl:rotate-180" />,
        closeOnClick: false,
        onClick: () =>
          logout({
            redirectTo:
              experience === 'hiring-manager'
                ? HIRING_MANAGER_START_HREF
                : EMPLOYER_LANDING_HREF,
          }),
      }}
      actionsClassName="mt-5"
    >
      <div className="mt-4 flex flex-col gap-4 text-start">
        <section className="bg-body-bg border-border overflow-hidden rounded-2xl border">
          <div className="border-border flex items-center gap-4 border-b px-5 py-4.5">
            <span className="bg-primary-bg text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
              <Briefcase aria-hidden="true" className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[13px]">
                {t('hiring-project')}
              </span>
              <span className="text-secondary font-semibold">
                {projectName}
              </span>
            </div>
          </div>
          <ul className="grid grid-cols-3 py-5">
            {stats.map(({ icon: Icon, value, label, iconClass }) => (
              <li
                key={label}
                className="border-border flex flex-col items-center gap-2 px-2 text-center not-last:border-e"
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    iconClass,
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span
                  className={cn(
                    'text-secondary font-bold',
                    typeof value === 'number' ? 'text-2xl' : 'text-base',
                  )}
                >
                  {value}
                </span>
                <span className="text-muted-foreground max-w-24 text-[13px] leading-4">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-muted-foreground flex items-center gap-4 px-5 text-[15px] leading-5.5">
          <span className="bg-assessment-link-info text-assessment-link-info-text flex size-11 shrink-0 items-center justify-center rounded-full">
            <Send aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          </span>
          {t('success-notice')}
        </p>
      </div>
    </SuccessModal>
  );
}
