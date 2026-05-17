import type { MessagePayload } from "firebase/messaging";
import { getFirebaseMessaging } from "@/shared/lib/firebase";

type ForegroundMessageHandler = (payload: MessagePayload) => void;

export function listenForMessages(
  onForegroundMessage?: ForegroundMessageHandler,
) {
  let unsubscribe: (() => void) | undefined;
  let cancelled = false;

  void (async () => {
    const messaging = await getFirebaseMessaging();
    if (cancelled || !messaging) {
      console.warn(
        "[Notifications] Foreground listener not attached: messaging unavailable.",
      );
      return;
    }

    const { onMessage } = await import("firebase/messaging");
    console.info("[Notifications] Foreground listener attached.");

    unsubscribe = onMessage(messaging, (payload) => {
      console.info("[Notifications] Foreground message received.", payload);
      onForegroundMessage?.(payload);
    });
  })();

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}
