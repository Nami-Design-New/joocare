interface Props {
    step: number;
}

const steps = ["Account Setup", "Business Verification", "Company Profile"];

export default function WizardProgress({ step }: Props) {
    return (<>
        <div className="flex justify-between items-center mb-2">
            {steps.map((_, index) => (<>
                <div
                    key={index}
                    className={`w-9 h-9 rounded-full flex items-center justify-center
                       p-2 text-lg font-semibold z-30
                       ${step >= index ? "bg-primary text-white" : "bg-muted text-disabled"}
                        `}
                >
                    {index + 1}
                </div>

                {index !== steps.length - 1 && (
                    <div
                        className={` w-full  flex-1 p-1.5
                        ${step > index ? "bg-primary" : "bg-muted"}`}
                        style={{ marginLeft: "-.05rem", marginRight: "-.05rem" }}
                    />
                )}
            </>
            ))}
        </div>

        <div className="flex w-full  justify-between items-center mb-8">
            {steps.map((label, index) => <span key={index} className={`text-sm md:text-lg ${step >= index ? "" : "text-disabled"}`}>
                {label}
            </span>
            )}
        </div>
    </>
    );
}