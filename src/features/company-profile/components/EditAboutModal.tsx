"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

import { useUpdateBio } from "../hooks/useUpdateBio";
import { useTranslations } from "next-intl";

interface EditAboutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultVal: string;
}

type FormValues = {
    bio: string;
};

export function EditAboutModal({
    open,
    onOpenChange,
    defaultVal,
}: EditAboutModalProps) {
    const t = useTranslations();
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    const { mutate: updateBio, isPending } = useUpdateBio({ token });

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            bio: defaultVal,
        },
    });

    useEffect(() => {
        if (open) {
            reset({ bio: defaultVal });
        }
    }, [open, defaultVal, reset]);

    const onSubmit = (data: FormValues) => {
        updateBio(
            { bio: data.bio },
            {
                onSuccess: () => {
                    toast.success(t("companyPage.profile.about.toasts.updated-successfully"));
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error?.message || t("companyPage.common.something-went-wrong"));
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-175 flex flex-col gap-5">
                <DialogHeader>
                    <DialogTitle className="text-[28px] text-black">
                        {t("companyPage.profile.about.modal.title")}
                    </DialogTitle>
                </DialogHeader>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                className="p-4 rounded-2xl bg-muted min-h-40"
                                placeholder={t("companyPage.profile.about.modal.placeholder")}
                            />
                        )}
                    />

                    <DialogFooter className="flex justify-center! w-full">
                        <Button
                            className="w-1/3"
                            size="pill"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? t("common.saving") : t("common.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
