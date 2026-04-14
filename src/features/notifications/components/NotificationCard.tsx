import Image from "next/image";

type NotificationCardProps = {
  title: string;
  message: string;
  createdAt?: string;
  isRead: boolean;
  isPending?: boolean;
  onClick?: () => void;
};

export default function NotificationCard({
  title,
  message,
  createdAt,
  isRead,
  isPending = false,
  onClick,
}: NotificationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`border-b-border flex w-full items-start gap-3 border-b border-dashed p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
        isRead
          ? "bg-white"
          : "bg-[#F4F8F6] hover:bg-[#EDF4F1]"
      }`}
    >
      <Image
        src="/assets/comp-logo.svg"
        width={52}
        height={46}
        alt="company Logo"
        className="h-11 w-11 rounded-full object-contain"
      />
      <div className="min-w-0 flex-1">
        <h6 className="text-foreground text-md leading-7 font-medium">
          {title}
        </h6>
        <p className="text-muted-foreground mt-1 text-sm break-words">
          {message}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {isPending ? "Loading..." : createdAt || "Now"}
        </p>
      </div>
    </button>
  );
}
