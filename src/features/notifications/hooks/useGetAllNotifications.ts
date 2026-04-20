"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AuthApiRole } from "@/shared/lib/api-endpoints";
import { Notification, NotificationsResponse } from "../notifications.types";
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

  const query = useInfiniteQuery<NotificationsResponse, Error>({
    queryKey: notificationsQueryKey(role),
    queryFn: async ({ pageParam = 1 }): Promise<NotificationsResponse> => {
      if (!role || !token) {
        throw new Error("Missing notification auth context.");
      }

      const res = await getNotifications({
        role,
        page: Number(pageParam),
        limit,
        token,
      });

      if (!res.ok || !res.data?.data) {
        throw new Error(res.message || "Failed to load notifications.");
      }
      // console.log("notification s ::", res.data.data);

      return res.data.data;
    },
    getNextPageParam: (lastPage) => {
      const current = lastPage?.current_page ?? 1;
      const last = lastPage?.last_page ?? 1;

      if (current < last) {
        return current + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!token && !!role,
  });

  const pages = query.data?.pages ?? [];
  const data: Notification[] = pages.flatMap((page) => page?.data ?? []);
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
