import Image from 'next/image';
import type { PermissionNoticeData } from '../../types/permissions.types';

export default function PermissionNotice({
  title,
  description,
}: PermissionNoticeData) {
  return (
    <div
      className="bg-muted flex items-start gap-2.5 rounded-xl p-4 text-sm leading-[normal]"
      dir="ltr"
    >
      <Image
        src="/assets/icons/permissions/restriction-lock.svg"
        width={18}
        height={18}
        alt=""
        className="shrink-0"
      />
      <div className="min-w-0 space-y-1">
        {title ? <p className="text-secondary font-semibold">{title}</p> : null}
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
