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
      title="Please login"
      description="Please login first to take full advantage of the platform's features."
      confirmLabel="Login"
      hasCancelButton={false}
      onConfirm={() => {
        onOpenChange(false);
        router.push("/auth/candidate/login");
      }}
    />
  );
}
