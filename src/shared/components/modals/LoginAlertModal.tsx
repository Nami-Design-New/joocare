"use client";

import { useRouter } from "@/i18n/navigation";
import AlertModal from "./AlertModal";

type LoginAlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginAlertModal({
  open,
  onOpenChange,
}: LoginAlertModalProps) {
  const router = useRouter();

  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      title="Unlock your opportunities"
      description="Sign in to explore relevant roles, manage applications, and stay updated on opportunities tailored to your profile."
      confirmLabel="Login"
      hasCancelButton={false}
      onConfirm={() => {
        onOpenChange(false);
        router.push("/auth/candidate/login");
      }}
    />
  );
}
