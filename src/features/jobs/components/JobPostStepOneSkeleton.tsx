import { Skeleton } from "@/shared/components/ui/skeleton";
import { Fragment } from "react/jsx-runtime";

function StepOneSkeletonField({
    withLabel = true,
    withHint = false,
    inputClassName,
}: {
    withLabel?: boolean;
    withHint?: boolean;
    inputClassName?: string;
}) {
    return (
        <div className="space-y-2">
            {withLabel && <Skeleton className="h-4 w-28 rounded-full bg-gray-100" />}
            {withHint && <Skeleton className="h-3 w-40 rounded-full bg-gray-100" />}
            <Skeleton className={inputClassName ?? "h-13 w-full rounded-full bg-gray-200"} />
        </div>
    );
}

export function JobPostStepOneSkeleton({ hasSteps = false }: { hasSteps?: boolean }) {
    return (
        <div className="space-y-4">
            {hasSteps && (
                <div className={`w-full`}>
                    <div className="mb-2 flex items-center justify-between">
                        {[1, 2, 3].map((_, index) => (
                            <Fragment key={index}>
                                <div
                                    key={index}
                                    className={`flex h-9 w-9 items-center justify-center rounded-full p-2 text-lg font-semibold bg-muted text-disabled`}
                                >
                                    {index + 1}
                                </div>

                                {index !== [1, 2, 3].length - 1 && (
                                    <div
                                        className={`w-full flex-1 p-1.5 bg-muted`}
                                        style={{ marginLeft: "-.05rem", marginRight: "-.05rem" }}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>

                    <div className="mb-8 flex w-full items-center justify-between">
                        {[1, 2, 3].map((label, index) => (
                            <span
                                key={index}
                                className={`text-sm md:text-lg text-disabled`}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <StepOneSkeletonField />
                <StepOneSkeletonField />
            </div>

            <div className="rounded-[12px] bg-muted p-3">
                <div className="mb-5 flex items-center justify-between">
                    <Skeleton className="h-5 w-48 rounded-full" />
                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <StepOneSkeletonField />
                    <StepOneSkeletonField />
                    <StepOneSkeletonField />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StepOneSkeletonField />
                <StepOneSkeletonField />
            </div>

            <div className="rounded-[12px] bg-muted p-3">
                <Skeleton className="mb-5 h-4 w-40 rounded-full" />
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <StepOneSkeletonField />
                    <StepOneSkeletonField />
                    <StepOneSkeletonField />
                </div>
            </div>

            <div className="rounded-[12px] bg-muted p-3">
                <Skeleton className="mb-5 h-4 w-24 rounded-full" />
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <StepOneSkeletonField />
                    <StepOneSkeletonField />
                </div>
            </div>

            <StepOneSkeletonField />

            <div className="rounded-[12px] bg-muted p-3">
                <Skeleton className="mb-5 h-4 w-52 rounded-full" />
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <StepOneSkeletonField />
                    <div className="space-y-3">
                        <StepOneSkeletonField />
                        <div className="flex items-end gap-3">
                            <StepOneSkeletonField inputClassName="h-13 w-full rounded-full" />
                            <Skeleton className="mb-0.5 h-13 w-28 shrink-0 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[12px] bg-muted p-3">
                <Skeleton className="mb-5 h-4 w-24 rounded-full" />
                <StepOneSkeletonField />
            </div>
        </div>
    );
}