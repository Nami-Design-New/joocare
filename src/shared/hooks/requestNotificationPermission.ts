import { getFirebaseMessaging } from "@/shared/lib/firebase";

const vapidKey =
  "BLZpduvGv1XFGZegMfGxGAHquj-pp3C-eyEJJXqURVzKSQWakGiz8i3oejcsP2RKrqdnj4mGxoijIcAYWlMkMVI";
const PROMPTED_SESSION_KEY = "notification-permission-prompted";
const TOKEN_REQUESTED_SESSION_KEY = "notification-token-requested";
const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

function hasSessionStorage() {
  try {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  } catch {
    return false;
  }
}

function canUseBrowserNotifications() {
  const serviceWorker = typeof navigator !== "undefined" ? navigator.serviceWorker : undefined;

  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Boolean(serviceWorker) &&
    typeof serviceWorker?.register === "function" &&
    typeof serviceWorker?.getRegistration === "function" &&
    hasSessionStorage()
  );
}

async function registerMessagingServiceWorker() {
  console.info(
    "[Notifications] Checking service worker registration:",
    SERVICE_WORKER_PATH,
  );

  const serviceWorker = navigator.serviceWorker;
  if (!serviceWorker) {
    throw new Error("Service workers are unavailable.");
  }

  const existingRegistration = await serviceWorker
    .getRegistration(SERVICE_WORKER_PATH)
    .catch(() => undefined);

  if (existingRegistration) {
    console.info("[Notifications] Reusing existing service worker registration.");
    return existingRegistration;
  }

  console.info("[Notifications] Registering firebase messaging service worker.");
  return serviceWorker.register(SERVICE_WORKER_PATH, {
    scope: "/",
  });
}

type RequestNotificationPermissionOptions = {
  forcePrompt?: boolean;
};

export async function requestNotificationPermission(
  options: RequestNotificationPermissionOptions = {},
): Promise<string | null> {
  const { forcePrompt = false } = options;

  if (!canUseBrowserNotifications()) {
    console.warn(
      "[Notifications] Messaging is unavailable or browser notifications are unsupported.",
    );
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.warn(
      "[Notifications] Messaging is unavailable or browser notifications are unsupported.",
    );
    return null;
  }

  console.info("[Notifications] Starting permission/token flow.", {
    currentPermission: Notification.permission,
    forcePrompt,
  });

  const promptedThisSession =
    window.sessionStorage.getItem(PROMPTED_SESSION_KEY) === "true";
  const requestedTokenThisSession =
    window.sessionStorage.getItem(TOKEN_REQUESTED_SESSION_KEY) === "true";

  if (Notification.permission === "denied") {
    console.warn("[Notifications] Permission is denied in browser settings.");
    return null;
  }

  if (
    Notification.permission === "default" &&
    promptedThisSession &&
    !forcePrompt
  ) {
    console.info("[Notifications] Permission prompt already shown this session.");
    return null;
  }

  if (
    Notification.permission === "granted" &&
    requestedTokenThisSession &&
    !forcePrompt
  ) {
    console.info("[Notifications] Token already requested this session.");
    return null;
  }

  let permission: NotificationPermission = Notification.permission;

  if (permission === "default") {
    console.info("[Notifications] Requesting browser notification permission.");
    window.sessionStorage.setItem(PROMPTED_SESSION_KEY, "true");
    permission = await Notification.requestPermission();
    console.info("[Notifications] Permission request resolved.", { permission });
  }

  if (permission !== "granted") {
    console.warn("[Notifications] Permission not granted.", { permission });
    return null;
  }

  window.sessionStorage.setItem(TOKEN_REQUESTED_SESSION_KEY, "true");
  const serviceWorkerRegistration = await registerMessagingServiceWorker();
  console.info("[Notifications] Service worker ready.", {
    scope: serviceWorkerRegistration.scope,
  });

  const { getToken } = await import("firebase/messaging");
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  });

  console.info("[Notifications] FCM token resolved.", {
    hasToken: Boolean(token),
    token,
  });
  return token;
}
