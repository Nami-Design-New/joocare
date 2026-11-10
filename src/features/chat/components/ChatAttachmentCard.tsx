import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import type { ChatAttachment } from '../types/chat.types';
import ChatIcon from './ChatIcon';

type ChatAttachmentCardProps = {
  attachment: ChatAttachment;
  onPreview: (attachment: ChatAttachment) => void;
  onDownload: (attachment: ChatAttachment) => void;
};

export default function ChatAttachmentCard({
  attachment,
  onPreview,
  onDownload,
}: ChatAttachmentCardProps) {
  const t = useTranslations('companyPage.chat');
  if (attachment.kind === 'image' && attachment.url) {
    return (
      <div className="min-w-0 space-y-2">
        <button
          type="button"
          className="focus-visible:ring-chat-primary block w-full cursor-pointer overflow-hidden rounded-lg outline-none focus-visible:ring-2"
          onClick={() => onPreview(attachment)}
          aria-label={t('preview-image', { name: attachment.name })}
        >
          <Image
            src={attachment.url}
            width={368}
            height={170}
            alt={attachment.name}
            unoptimized
            className="max-h-64 w-full object-cover"
          />
        </button>
        <p className="text-muted-foreground truncate text-[11px] leading-3.5">
          <bdi>
            {attachment.name} · {attachment.size}
          </bdi>
        </p>
      </div>
    );
  }
  return (
    <div className="bg-card/50 border-border text-foreground flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3">
      <span className="flex shrink-0 items-center justify-center">
        <ChatIcon name="file" width={14} height={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs leading-4 font-semibold">
          <bdi>{attachment.name}</bdi>
        </span>
        <span className="text-muted-foreground mt-1 block text-[10px] leading-3.5">
          <bdi>{attachment.size} • PDF</bdi>
        </span>
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDownload(attachment)}
        aria-label={t('download-file', { name: attachment.name })}
      >
        <ChatIcon name="download" width={11} height={11} />
      </Button>
    </div>
  );
}
