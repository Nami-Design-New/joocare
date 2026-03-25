"use client"

import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Minus } from "lucide-react"

import { InputField } from "@/shared/components/InputField"
import LabelCheckbox from "@/shared/components/LabelCheckbox"
import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { experienceModalSchema, FormData } from "../../validation/experience-modal-schema"

interface ExperienceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string
}

// ==================
// Component
// ==================
export function ExperienceModal({ open, onOpenChange, label }: ExperienceModalProps) {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(experienceModalSchema),
        defaultValues: {
            responsibilities: [{ value: "" }],
            workHere: false,
        },
    })

    // ==================
    // dynamic fields
    // ==================
    const { fields, append, remove } = useFieldArray({
        control,
        name: "responsibilities",
    })

    // ==================
    // watch checkbox
    // ==================
    const workHere = watch("workHere")

    // ==================
    // submit
    // ==================
    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="max-w-175 flex flex-col gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">
                            {label}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Job title */}
                    <InputField
                        id="jobTitle"
                        label="Job title"
                        placeholder="ex: Senior Heart Specialist"
                        {...register("jobTitle")}
                        error={errors.jobTitle?.message}
                    />

                    {/* Organization */}
                    <InputField
                        id="organizationOrHospitalName"
                        label="Organization/Hospital Name"
                        placeholder="ex: health care"
                        {...register("organizationOrHospitalName")}
                        error={errors.organizationOrHospitalName?.message}
                    />

                    {/* Dates */}
                    <div className="flex gap-2">
                        <InputField
                            id="startDate"
                            label="Start Date"
                            type="date"
                            {...register("startDate")}
                            error={errors.startDate?.message}
                        />

                        <InputField
                            id="endDate"
                            label="End Date"
                            type="date"
                            disabled={workHere}
                            {...register("endDate")}
                            error={errors.endDate?.message}
                        />
                    </div>

                    {/* Checkbox */}
                    <Controller
                        name="workHere"
                        control={control}
                        render={({ field }) => (
                            <LabelCheckbox
                                id="workHere"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            >
                                I currently work here
                            </LabelCheckbox>
                        )}
                    />

                    {/* ================== */}
                    {/* Responsibilities */}
                    {/* ================== */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium">
                            Responsibilities
                        </label>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-2">
                                <InputField
                                    id={`responsibilities-${index}`}
                                    placeholder="Describe your Responsibilities"
                                    {...register(`responsibilities.${index}.value`)}
                                    error={
                                        errors.responsibilities?.[index]?.value?.message
                                    }
                                />

                                {/* Add button */}
                                {index === fields.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => append({ value: "" })}
                                        className="w-15 h-13 bg-secondary text-white rounded-full flex items-center justify-center"
                                    >
                                        <Plus />
                                    </button>
                                )}

                                {/* Remove button */}
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-15 h-13 bg-muted text-secondary border rounded-full flex items-center justify-center"
                                    >
                                        <Minus />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <DialogFooter className="flex items-center justify-center!">
                        <Button className="w-1/3 hover:bg-primary/70" size="pill" type="submit">
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}