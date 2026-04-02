import { FilepondUpload } from "@/shared/components/FilepondUpload";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
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

interface LicenseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string
}
export function LicenseModal({ open, onOpenChange, label }: LicenseModalProps) {
    const { control } = useForm({})
    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
                    </DialogHeader>


                    <InputField
                        id="licenseTitle"
                        label="License Title"
                        type="text"
                        placeholder="ex: License Title"
                    // {...register("licenseTitle")}
                    // error={errors.licenseTitle?.message}
                    />

                    <InputField
                        id="licenseNumber"
                        label="License Number"
                        type="text"
                        placeholder="ex: 234234"
                    // {...register("licenseNumber")}
                    // error={errors.licenseNumber?.message}
                    />

                    {/* Country */}
                    {/* <Controller
                            name="country"
                            // control={control}
                            render={({ field }) => ( */}
                    <SelectInputField
                        id="country"
                        label="Country"
                        placeholder="ex: United Arab Emirates (UAE)"
                        // error={errors.country?.message}
                        options={[
                            { label: "egypt", value: "egypt" },
                            { label: "bahrin", value: "bahrin" },
                            { label: "saudi", value: "saudi" },
                        ]}
                    />
                    {/* )} */}
                    {/* /> */}

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

                    <DialogFooter className="flex items-center justify-center!">
                        <Button className="w-1/3" size={"pill"} type="submit">Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
        , document.body
    )
}