import FormForgetPassword from '@/features/auth/components/forget-password/FormForgetPassword'

const ForgetPassword = () => {
  return (
    <main className="flex items-center justify-center h-[calc(100dvh-85px)]">
      <section className="flex flex-col items-center gap-6  p-6 rounded-2xl  w-full max-w-125 shadow-soft">
        <h1 className="text-2xl font-bold">Enter the new email</h1>
        <p className="text-center text-sm text-muted-foreground">
          A verification code will be sent to the new email address
        </p>

        {/* form  */}
        <FormForgetPassword btnLabel='Send' />

      </section>

    </main>
  )
}

export default ForgetPassword
