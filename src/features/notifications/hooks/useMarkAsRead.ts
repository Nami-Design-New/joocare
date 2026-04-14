"use client";

import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AuthApiRole } from "@/shared/lib/api-endpoints";
import { NotificationsResponse } from "../notifications.types";
import { markNotificationAsRead } from "../service/notifications-service";
import { notificationsQueryKey } from "./useGetAllNotifications";

type NotificationsInfiniteData = InfiniteData<NotificationsResponse>;

function patchNotificationReadState(
  currentData: NotificationsInfiniteData | undefined,
  notificationId: number,
) {
  if (!currentData) {
    return currentData;
  }

  return {
    ...currentData,
    pages: currentData.pages.map((page) => ({
      ...page,
      data: page.data.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification,
      ),
    })),
  } satisfies NotificationsInfiniteData;
}

export function useMarkAsRead(
  role: AuthApiRole | undefined,
  token: string | undefined,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (notificationId: number) => {
      if (!role || !token) {
        throw new Error("Missing notification auth context.");
      }

      const response = await markNotificationAsRead({
        role,
        token,
        notificationId,
      });

      if (!response.ok) {
        throw new Error(response.message || "Failed to mark notification as read.");
      }

      return notificationId;
    },
    onMutate: async (notificationId) => {
      const queryKey = notificationsQueryKey(role);

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<NotificationsInfiniteData>(queryKey);

      queryClient.setQueryData<NotificationsInfiniteData>(queryKey, (currentData) =>
        patchNotificationReadState(currentData, notificationId),
      );

      return {
        previousData,
      };
    },
    onError: (error, _notificationId, context) => {
      queryClient.setQueryData(
        notificationsQueryKey(role),
        context?.previousData,
      );
      toast.error(error.message || "Failed to mark notification as read.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(role),
      });
    },
  });

  return {
    markAsRead: mutation.mutate,
    markAsReadAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    pendingNotificationId: mutation.variables ?? null,
  };
}
