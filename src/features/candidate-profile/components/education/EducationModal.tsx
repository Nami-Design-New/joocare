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

interface EducationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string
}
export function EducationModal({ open, onOpenChange, label }: EducationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
                    </DialogHeader>

                    <InputField
                        id="degree"
                        label="Degree"
                        type="text"
                        placeholder="ex: Bachelor's degree, Medicine and Surgery"
                    // {...register("degree")}
                    // error={errors.degree?.message}
                    />
                    <InputField
                        id="university"
                        label="University"
                        type="text"
                        placeholder="ex: Ain Shams University - Faculty of Medicine"
                    // {...register("university")}
                    // error={errors.university?.message}
                    />
                    {/* Country */}
                    {/* <Controller
                            name="country"
                            // control={control}
                            render={({ field }) => ( */}
                    <SelectInputField
                        id="country"
                        label="Country"
                        placeholder="ex: Egypt"
                        // error={errors.country?.message}
                        options={[
                            { label: "egypt", value: "egypt" },
                            { label: "bahrin", value: "bahrin" },
                            { label: "saudi", value: "saudi" },
                        ]}
                    />
                    {/* )} */}
                    {/* /> */}
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
        </Dialog>
    )
}