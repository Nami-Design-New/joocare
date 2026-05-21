import type { MessagePayload } from "firebase/messaging";
import { getFirebaseMessaging } from "@/shared/lib/firebase";

type ForegroundMessageHandler = (payload: MessagePayload) => void;

let foregroundListenerAttached = false;
const foregroundHandlers = new Set<ForegroundMessageHandler>();

export function listenForMessages(
  onForegroundMessage?: ForegroundMessageHandler,
) {
  if (onForegroundMessage) {
    foregroundHandlers.add(onForegroundMessage);
  }

  if (!foregroundListenerAttached) {
    foregroundListenerAttached = true;

    void (async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.warn(
          "[Notifications] Foreground listener not attached: messaging unavailable.",
        );
        foregroundListenerAttached = false;
        return;
      }

      const { onMessage } = await import("firebase/messaging");
      console.info("[Notifications] Foreground listener attached.");

      onMessage(messaging, (payload) => {
        console.info("[Notifications] Foreground message received.", payload);

        foregroundHandlers.forEach((handler) => {
          handler(payload);
        });
      });
    })();
  }

  return () => {
    if (onForegroundMessage) {
      foregroundHandlers.delete(onForegroundMessage);
    }
  };
}
