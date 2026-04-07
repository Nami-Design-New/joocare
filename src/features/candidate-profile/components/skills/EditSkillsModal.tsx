"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  addUserSkills,
  getSkillOptions,
  getUserSkills,
  type SkillOption,
} from "../../services/skills-client-service";
import { MultiSelectInputSkills } from "./MultiSelectInputSkills";

interface EditSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: string[];
  onSave: (skills: string[]) => void;
}

export function EditSkillsModal({
  open,
  onOpenChange,
  skills,
  onSave,
}: EditSkillsModalProps) {
  const locale = useLocale();
  const { data: session } = useSession();
  const [current, setCurrent] = useState<string[]>(skills);
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    if (!open || !session?.accessToken) {
      return;
    }

    const loadSkills = async () => {
      try {
        setIsLoading(true);
        const [availableSkills, currentSkills] = await Promise.all([
          getSkillOptions({ locale, token: session.accessToken }),
          getUserSkills({ locale, token: session.accessToken }),
        ]);

        if (!ignore) {
          setOptions(availableSkills);
          setCurrent(currentSkills.map((skill) => skill.label));
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message : "Failed to load skills.";
          toast.error(message);
          setCurrent(skills);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadSkills();

    return () => {
      ignore = true;
    };
  }, [locale, open, session?.accessToken, skills]);

  const availableLabels = useMemo(
    () => options.map((skill) => skill.label),
    [options],
  );

  const toggle = (skill: string) => {
    setCurrent((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const remove = (skill: string) => {
    setCurrent((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      const selectedIds = current
        .map(
          (label) => options.find((skill) => skill.label === label)?.id ?? null,
        )
        .filter((id): id is string => Boolean(id));

      await addUserSkills({
        skillIds: selectedIds,
        locale,
        token: session.accessToken,
      });

      toast.success("Skills updated successfully.");
      onSave(current);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update skills.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">Skill</label>
          <MultiSelectInputSkills
            selected={current}
            onSelect={toggle}
            onRemove={remove}
            options={availableLabels}
          />
        </div>

        {/* <div className="space-y-2">
          <p className="text-sm">Suggested based on your profile</p>
          <div className="bg-[#09760A08] flex min-h-[60px] flex-wrap gap-2 rounded-xl p-3">
            {availableLabels.map((skill) => {
              const isSelected = current.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggle(skill)}
                  className={`rounded-full border border-border px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted bg-white text-black hover:border-primary hover:text-primary"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div> */}

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleSave}
            className="rounded-full px-10"
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
