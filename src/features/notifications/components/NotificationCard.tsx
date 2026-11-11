import Image from 'next/image';

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
      className={`flex w-full items-start gap-3 border-b border-dashed border-b-border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
        isRead ? 'bg-white' : 'bg-[#F4F8F6] hover:bg-[#EDF4F1]'
      }`}
    >
      <Image
        src="/assets/new-logo-dot.svg"
        width={52}
        height={46}
        alt="company Logo"
        className="h-11 w-11 rounded-full object-contain"
      />
      <div className="min-w-0 flex-1">
        <h6 className="text-sm leading-7 font-medium text-foreground md:text-base">
          {title}
        </h6>
        <p className="mt-1 text-xs break-words text-muted-foreground md:text-sm">
          {message}
        </p>
        <p className="mt-2 text-xs text-muted-foreground md:text-sm">
          {createdAt}
        </p>
      </div>
    </button>
  );
}
