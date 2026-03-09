import { Button } from "@/shared/components/ui/button"

const CompleteDetails = () => {
    return (
        <section className="bg-[#DC26260D]  rounded-2xl flex flex-col gap-3 py-3 px-4">

            <h3 className="text-destructive text-xl font-semibold">Please complete your details.</h3>

            <p className="text-base text-muted-foreground">
                Please complete your account details so you can use the platform normally and benefit from all its features.
            </p>

            <Button className="bg-destructive hover:bg-destructive/70 w-full rounded-full py-6 text-base">Complete Now </Button>
        </section>
    )
}

export default CompleteDetails
