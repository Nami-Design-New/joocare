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
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

export function DrawerScrollableContent({
  title,
  open,
  onOpenChange,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();
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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);
  isFetchingNextPageRef.current = isFetchingNextPage;

  const loadMoreLockRef = useRef(false);

  useEffect(() => {
    if (!isFetchingNextPage) {
      loadMoreLockRef.current = false;
    }
  }, [isFetchingNextPage]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore) return;
    if (loading) return;
    if (isFetchingNextPageRef.current) return;
    if (loadMoreLockRef.current) return;

    loadMoreLockRef.current = true;
    void loadMore();
  }, [hasMore, loading, loadMore]);

  const { setRootRef, setTargetRef } = useInfiniteScroll({
    enabled: open && hasMore && !loading,
    onLoadMore: handleLoadMore,
    rootMargin: "300px 0px",
    threshold: 0,
  });

  const setScrollContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      setRootRef(node);
    },
    [setRootRef],
  );

  useEffect(() => {
    if (!open || loading || isFetchingNextPage || !hasMore) {
      return;
    }

    const el = scrollContainerRef.current;
    if (!el) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const isScrollable = container.scrollHeight > container.clientHeight + 1;
      if (!isScrollable) {
        void loadMore();
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [data.length, hasMore, isFetchingNextPage, loading, loadMore, open]);

  async function handleNotificationClick(item: Notification) {
    if (!item.is_read) {
      try {
        await markAsReadAsync(item.id);
      } catch {
        return;
      }
    }

    if (role !== "employer") {
      return;
    }

    if (
      item.action === "expired_commercial_registration" ||
      item.action === "expired_license" ||
      item.action === "rejected_profile"
    ) {
      onOpenChange(false);
      router.push("/company/account-settings/business-verification");
      return;
    }

    if (item.action === "received_application" && item.data.job_id) {
      onOpenChange(false);
      router.push(`/company/job/candidates/${item.data.job_id}`);
      return;
    }

    if (item.action === "approved_profile") {
      return;
    }
  }
  // console.log('data notify:::', data);


  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white overflow-hidden flex flex-col">
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

        <div className="flex-1 min-h-0 overflow-hidden">
          <div
            ref={setScrollContainerRef}
            className="no-scrollbar z-10 h-full space-y-3 overflow-y-auto px-4"
            style={{ maxHeight: "80vh" }}
          >
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
              {t("header.loading")}
            </p>
          )}

          {isFetchingNextPage && (
            <p className="text-sm text-gray-500">
              {t("header.loading")}
            </p>
          )}

            <div
              ref={setTargetRef}
              className="h-12 w-full"
              aria-hidden="true"
            />

          {!hasMore && data.length > 0 && (
            <p className="text-sm text-gray-400 text-center">
              {t("header.no-more-notifications")}
            </p>
          )}

          {!loading && data.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              {t("header.no-notifications-yet")}
            </p>
          )}

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
