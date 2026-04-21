"use client";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/shared/components/ui/drawer";
import { X } from "lucide-react";
import NotificationCard from "../../../features/notifications/components/NotificationCard";
import { useInfiniteScroll } from "@/features/notifications/hooks/useInfiniteScroll";
import { useSession } from "next-auth/react";
import { useNotificationsInfinite } from "@/features/notifications/hooks/useGetAllNotifications";
import { useMarkAllAsRead } from "@/features/notifications/hooks/useMarkAllAsRead";
import { useMarkAsRead } from "@/features/notifications/hooks/useMarkAsRead";
import { Notification } from "@/features/notifications/notifications.types";

export function DrawerScrollableContent({
  title,
  open,
  onOpenChange,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const role = session?.authRole;
  const {
    data,
    unreadCount,
    loadMore,
    hasMore,
    loading,
    isFetchingNextPage,
  } = useNotificationsInfinite(role, token);
  const { markAsReadAsync, isPending, pendingNotificationId } = useMarkAsRead(
    role,
    token,
  );
  const { markAllAsRead, isPending: isMarkAllPending } = useMarkAllAsRead(
    role,
    token,
  );

  const loadMoreRef = useInfiniteScroll(() => {
    if (!isFetchingNextPage) {
      void loadMore();
    }
  }, hasMore);

  async function handleNotificationClick(item: Notification) {
    console.log("itemsssssss::::: ", item);

    if (!item.is_read) {
      try {
        await markAsReadAsync(item.id);
      } catch {
        return;
      }
    }

    if (role === "employer" && item.action === "rejected_profile") {
      onOpenChange(false);
      router.push("/company/complete-account");
    }
  }
  // console.log('data notify:::', data);

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <DrawerTitle>{title}</DrawerTitle>
            {/* {unreadCount > 0 && (
              <span className="bg-primary inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )} */}
          </div>

          <div className="flex items-center gap-2">
            {/* {data.length > 0 && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={isMarkAllPending}
              >
                {isMarkAllPending ? "Saving..." : "Mark all read"}
              </Button>
            )} */}
            <Button
              variant="outline"
              className="border-0"
              size="icon-lg"
              onClick={() => onOpenChange(false)}
            >
              <X />
            </Button>
          </div>
        </DrawerHeader>

        <div className="no-scrollbar z-10 overflow-y-auto px-4 max-h-[80vh] space-y-3">
          {data.map((item) => (
            <NotificationCard
              key={item.id}
              title={item.title}
              message={item.message}
              createdAt={item.created_at}
              isRead={item.is_read}
              isPending={pendingNotificationId === item.id && isPending}
              onClick={() => void handleNotificationClick(item)}
            />
          ))}

          {loading && (
            <p className="text-sm text-gray-500">
              Loading...
            </p>
          )}

          <div ref={loadMoreRef} />

          {!hasMore && data.length > 0 && (
            <p className="text-sm text-gray-400 text-center">
              No more notifications
            </p>
          )}

          {!loading && data.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No notifications yet
            </p>
          )}

        </div>
      </DrawerContent>
    </Drawer>
  );
}
