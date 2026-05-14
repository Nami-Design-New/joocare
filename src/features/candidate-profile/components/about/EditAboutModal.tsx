"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCandidateBio } from "../../services/profile-client-service";
import {
  createAboutModalSchema,
  type AboutModalFormData,
} from "../../validation/about-modal-schema";

interface EditAboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultVal: string;
}
export function EditAboutModal({
  open,
  onOpenChange,
  defaultVal,
}: EditAboutModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const aboutSchema = useMemo(
    () =>
      createAboutModalSchema({
        bioMax: t("candidateValidation.bio-max"),
        bioMinWords: t("candidateValidation.bio-min-words"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutModalFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio: defaultVal,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        bio: defaultVal,
      });
    }
  }, [defaultVal, open, reset]);

  const onSubmit = async ({ bio }: AboutModalFormData) => {
    if (!session?.accessToken) {
      toast.error(t("candidatePage.toasts.session-expired"));
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateCandidateBio({
        bio: bio.trim(),
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? t("candidatePage.toasts.about-updated"));
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("candidatePage.toasts.about-update-failed");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-175 flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">
              {t("candidatePage.profile.edit-about")}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground -mt-2 text-sm">
            {t("candidatePage.profile.about-description")}
          </DialogDescription>

          <Textarea
            className="bg-muted min-h-40 rounded-2xl p-4"
            placeholder={t("candidatePage.profile.about-placeholder")}
            {...register("bio")}
          />
          {errors.bio?.message && (
            <span className="text-[12px] text-red-500">{errors.bio.message}</span>
          )}

          <DialogFooter className="flex justify-center!">
            <Button
              className="w-1/3"
              size={"pill"}
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? t("candidatePage.common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
