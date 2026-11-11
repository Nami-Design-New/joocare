import { getTranslations } from 'next-intl/server';
import FormCreatePassword from './FormCreatePassword';

export default async function CreatePasswordContent() {
  const namespace = 'authPage.pages.create-password';
  const [t, english, arabic] = await Promise.all([
    getTranslations(namespace),
    getTranslations({ locale: 'en', namespace }),
    getTranslations({ locale: 'ar', namespace }),
  ]);

  return (
    <div className="flex min-h-[calc(100dvh-4.75rem)] items-center justify-center px-5 py-10 md:px-8 lg:px-20 lg:pt-16 lg:pb-44 rtl:font-sans">
      <div className="flex w-full max-w-135 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl leading-tight sm:text-3xl lg:text-[40px]">
            {t('title')}
          </h1>
          <p
            dir="ltr"
            lang="en"
            className="text-start text-base leading-[23px] sm:text-lg"
          >
            {english('welcome', {
              name: english('member-name'),
              workspace: english('workspace-name'),
            })}
          </p>
          <p
            dir="rtl"
            lang="ar"
            className="text-start font-sans text-base leading-[23px] sm:text-lg"
          >
            {arabic('welcome', {
              name: arabic('member-name'),
              workspace: arabic('workspace-name'),
            })}
          </p>
          <div className="flex items-center gap-2.5 rounded-xl border border-warning/50 bg-warning/12 px-4 py-3 text-sm leading-[18px] text-warning-strong">
            <span
              aria-hidden="true"
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning text-[13px] font-semibold text-primary-foreground"
            >
              !
            </span>
            <p>{t('required-step')}</p>
          </div>
        </div>
        <FormCreatePassword />
      </div>
    </div>
  );
}
