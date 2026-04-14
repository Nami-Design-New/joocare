import { AuthApiRole, getAuthApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import {
    NotificationMutationResponse,
    NotificationsResponse,
} from "../notifications.types";

type NotificationsParams = {
    role: AuthApiRole;
    page?: number;
    limit?: number;
    token: string;
};

type NotificationActionParams = {
    role: AuthApiRole;
    token: string;
    notificationId: number;
};

type MarkAllNotificationsParams = {
    role: AuthApiRole;
    token: string;
};

function getNotificationsBaseUrl(role: AuthApiRole) {
    return getAuthApiUrl(role);
}

async function performNotificationAction(
    url: string,
    token: string,
) {
    // const methods = ["POST", "PATCH", "PUT"] as const;
    let lastResponse = null;


    const response = await apiFetch<NotificationMutationResponse>(url, {

        token,
    });

    lastResponse = response;

    if (response.ok) {
        return response;
    }

    if (!lastResponse) {
        throw new Error("Failed to update notification.");
    }

    return lastResponse;
}

export async function getNotifications({
    role,
    page = 1,
    limit = 10,
    token,
}: NotificationsParams) {
    const baseUrl = getNotificationsBaseUrl(role);

    const url = `${baseUrl}/notifications?pagination=on&limit_per_page=${limit}&page=${page}`;

    return apiFetch<NotificationsResponse>(url, {
        method: "GET",
        token,
    });
}

export async function markNotificationAsRead({
    role,
    token,
    notificationId,
}: NotificationActionParams) {
    const url = `${getNotificationsBaseUrl(role)}/notifications/${notificationId}`;

    return performNotificationAction(url, token);
}

export async function markAllNotificationsAsRead({
    role,
    token,
}: MarkAllNotificationsParams) {
    const url = `${getNotificationsBaseUrl(role)}/read-all/notifications`;

    return performNotificationAction(url, token);
}
