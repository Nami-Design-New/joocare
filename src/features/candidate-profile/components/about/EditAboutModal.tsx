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
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCandidateBio } from "../../services/profile-client-service";
import {
  aboutModalSchema,
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
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutModalFormData>({
    resolver: zodResolver(aboutModalSchema),
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
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateCandidateBio({
        bio: bio.trim(),
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? "About updated successfully.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update about information.";
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
              Edit About
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground -mt-2 text-sm">
            You can write about your years of experience, industry, or skills.
            People also talk about their achievements or previous job
            experiences
          </DialogDescription>

          <Textarea
            className="bg-muted min-h-40 rounded-2xl p-4"
            placeholder="Write a short summary about your experience, skills, and achievements."
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
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
