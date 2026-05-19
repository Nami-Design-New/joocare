"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AuthApiRole } from "@/shared/lib/api-endpoints";
import { Notification, NotificationsPage } from "../notifications.types";
import { getNotifications } from "../service/notifications-service";

type UseNotificationsInfiniteOptions = {
  enabled?: boolean;
  limit?: number;
};

export function notificationsQueryKey(role?: AuthApiRole) {
  return ["notifications", role] as const;
}

export function useNotificationsInfinite(
  role: AuthApiRole | undefined,
  token: string | undefined,
  options: UseNotificationsInfiniteOptions = {},
) {
  const { enabled = true, limit = 10 } = options;

  const query = useInfiniteQuery<NotificationsPage, Error>({
    queryKey: notificationsQueryKey(role),
    queryFn: async ({ pageParam = 1 }): Promise<NotificationsPage> => {
      if (!role || !token) {
        throw new Error("Missing notification auth context.");
      }

      return await getNotifications({
        role,
        page: Number(pageParam),
        limit,
        token,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next_page_url) {
        const current = lastPage?.current_page ?? 1;
        const last = lastPage?.last_page ?? 1;

        if (current < last) {
          return current + 1;
        }

        return undefined;
      }

      const url = new URL(lastPage.next_page_url);
      const page = Number(url.searchParams.get("page"));

      return Number.isNaN(page) ? undefined : page;
    },
    initialPageParam: 1,
    enabled: enabled && !!token && !!role,
  });

  const pages = query.data?.pages ?? [];
  const data: Notification[] = (() => {
    const seen = new Set<number>();
    const merged: Notification[] = [];

    for (const page of pages) {
      for (const item of page?.data ?? []) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        merged.push(item);
      }
    }

    return merged;
  })();
  const unreadCount = data.filter((item) => !item.is_read).length;
  const total = pages[0]?.total ?? data.length;

  return {
    data,
    total,
    unreadCount,
    loading: query.isLoading,
    refetch: query.refetch,
    loadMore: query.fetchNextPage,
    hasMore: Boolean(query.hasNextPage),
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
