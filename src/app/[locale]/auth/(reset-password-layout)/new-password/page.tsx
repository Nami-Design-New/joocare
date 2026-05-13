import FormNewPassword from '@/features/auth/components/forget-password/FormNewPassword'
import { getTranslations } from 'next-intl/server'

const NewPassword = async () => {
    const t = await getTranslations();

    return (
        <main className="flex items-center justify-center h-[calc(100dvh-85px)]">
            <section className="flex flex-col items-center gap-6  p-6 rounded-2xl  w-full max-w-125 shadow-soft">
                <h1 className="text-2xl font-bold">{t("authPage.new-password.title")}</h1>
                <p className="text-center text-sm text-muted-foreground">
                    {t("authPage.new-password.subtitle")}
                </p>

                {/* form  */}
                <FormNewPassword />
            </section>

        </main>
    )
}

export default NewPassword
