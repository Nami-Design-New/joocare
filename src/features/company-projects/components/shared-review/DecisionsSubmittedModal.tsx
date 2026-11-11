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
        <section className="overflow-hidden rounded-2xl border border-border bg-body-bg">
          <div className="flex items-center gap-4 border-b border-border px-5 py-4.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary">
              <Briefcase aria-hidden="true" className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] text-muted-foreground">
                {t('hiring-project')}
              </span>
              <span className="font-semibold text-secondary">
                {projectName}
              </span>
            </div>
          </div>
          <ul className="grid grid-cols-3 py-5">
            {stats.map(({ icon: Icon, value, label, iconClass }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-2 border-border px-2 text-center not-last:border-e"
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
                    'font-bold text-secondary',
                    typeof value === 'number' ? 'text-2xl' : 'text-base',
                  )}
                >
                  {value}
                </span>
                <span className="max-w-24 text-[13px] leading-4 text-muted-foreground">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="flex items-center gap-4 px-5 text-[15px] leading-5.5 text-muted-foreground">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-assessment-link-info text-assessment-link-info-text">
            <Send aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          </span>
          {t('success-notice')}
        </p>
      </div>
    </SuccessModal>
  );
}
