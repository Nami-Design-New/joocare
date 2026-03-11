import FormNewPassword from '@/features/auth/components/forget-password/FormNewPassword'

const NewPassword = () => {
    return (
        <main className="flex items-center justify-center h-[calc(100dvh-85px)]">
            <section className="flex flex-col items-center gap-6  p-6 rounded-2xl  w-full max-w-125 shadow-soft">
                <h1 className="text-2xl font-bold">New Password</h1>
                <p className="text-center text-sm text-muted-foreground">
                    Enter a strong password that’s easy to remember.
                </p>

                {/* form  */}
                <FormNewPassword />
            </section>

        </main>
    )
}

export default NewPassword
