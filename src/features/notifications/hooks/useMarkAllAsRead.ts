"use client";

import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AuthApiRole } from "@/shared/lib/api-endpoints";
import { NotificationsResponse } from "../notifications.types";
import { markAllNotificationsAsRead } from "../service/notifications-service";
import { notificationsQueryKey } from "./useGetAllNotifications";

type NotificationsInfiniteData = InfiniteData<NotificationsResponse>;

function patchAllNotificationsReadState(
  currentData: NotificationsInfiniteData | undefined,
) {
  if (!currentData) {
    return currentData;
  }

  return {
    ...currentData,
    pages: currentData.pages.map((page) => ({
      ...page,
      data: page.data.map((notification) => ({
        ...notification,
        is_read: true,
      })),
    })),
  } satisfies NotificationsInfiniteData;
}

export function useMarkAllAsRead(
  role: AuthApiRole | undefined,
  token: string | undefined,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!role || !token) {
        throw new Error("Missing notification auth context.");
      }

      const response = await markAllNotificationsAsRead({
        role,
        token,
      });

      if (!response.ok) {
        throw new Error(response.message || "Failed to mark all notifications as read.");
      }

      return response;
    },
    onMutate: async () => {
      const queryKey = notificationsQueryKey(role);

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<NotificationsInfiniteData>(queryKey);

      queryClient.setQueryData<NotificationsInfiniteData>(queryKey, (currentData) =>
        patchAllNotificationsReadState(currentData),
      );

      return {
        previousData,
      };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(
        notificationsQueryKey(role),
        context?.previousData,
      );
      toast.error(error.message || "Failed to mark all notifications as read.");
    },
    onSuccess: (response) => {
      toast.success(response.message || "All notifications marked as read.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(role),
      });
    },
  });

  return {
    markAllAsRead: mutation.mutate,
    isPending: mutation.isPending,
  };
}
