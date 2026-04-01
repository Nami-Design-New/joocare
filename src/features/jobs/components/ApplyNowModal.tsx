import { FilepondUpload } from "@/shared/components/FilepondUpload";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ApplyNowSchema, TApplyNowSchema } from "../validation/apply-now-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import { is } from "date-fns/locale";

interface ApplyNowModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function ApplyNowModal({ open, onOpenChange }: ApplyNowModalProps) {
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TApplyNowSchema>({
        resolver: zodResolver(ApplyNowSchema),
        defaultValues: {
            uploadCV: null,
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<TApplyNowSchema> = (data) => {
        console.log("test data submit");

        console.log(data);
        setIsOpenSuccessModal(true)
    }


    return (<>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-175 ">

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">CV submission required</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-muted-foreground text-lg">
                        To complete your application for this position, the medical entity needs to revi
                        ew your CV. You can upload the file now in (PDF) or (Word) format and apply immediately.
                    </DialogDescription>
                    <Controller
                        name="uploadCV"
                        control={control}
                        render={({ field }) => (
                            <FilepondUpload
                                label="Upload CV"
                                files={field.value}
                                onChange={(files) => field.onChange(files)}
                                allowMultiple={false}
                                maxFiles={1}
                                error={errors.uploadCV?.message as string}
                            />
                        )}
                    />
                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit">Apply Now</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
        <SuccessModal
            open={isOpenSuccessModal}
            onOpenChange={setIsOpenSuccessModal}
            title="Your advertisement has been successfully published!"
            description="Your advertisement is now available to thousands of medical professionals on the platform. We will notify you as soon as any suitable candidates apply. You can track statistics and applicant interactions through the dashboard."
        />    </>
    )
}