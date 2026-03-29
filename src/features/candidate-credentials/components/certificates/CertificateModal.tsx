import { FilepondUpload } from "@/shared/components/FilepondUpload";
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";

interface CertificateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string
}
export function CertificateModal({ open, onOpenChange, label }: CertificateModalProps) {
    const { control } = useForm({})
    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
                    </DialogHeader>

                    <Controller
                        name="uploadImage"
                        control={control}
                        render={({ field }) => (
                            <FilepondUpload
                                label={`Upload Image`}
                                files={field.value}
                                onChange={field.onChange}
                                allowMultiple={false}
                                maxFiles={2}
                            // error={errors.uploadImage?.message}
                            />
                        )}
                    />
                    <InputField
                        id="certificateName"
                        label="Certificate Name"
                        type="text"
                        placeholder="ex: Infection Control Diploma"
                    // {...register("certificateName")}
                    // error={errors.certificateName?.message}
                    />
                    <InputField
                        id="issuingOrganization"
                        label="Issuing Organization"
                        type="text"
                        placeholder="ex: American Heart Association"
                    // {...register("issuingOrganization")}
                    // error={errors.issuingOrganization?.message}
                    />


                    {/* date */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <InputField
                            id="startDate"
                            label="Start Date"
                            type="date"
                            placeholder="ex: Dec 2025"
                        // {...register("startDate")}
                        // error={errors.startDate?.message}
                        />
                        <InputField
                            id="endDate"
                            label="End Date"
                            type="date"
                            placeholder="ex: Dec 2025"
                        // {...register("endDate")}
                        // error={errors.endDate?.message}
                        />

                    </div>

                    <DialogFooter className="flex items-center justify-center!">
                        <Button className="w-1/3" size={"pill"} type="submit">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>,
        document.body
    )
}