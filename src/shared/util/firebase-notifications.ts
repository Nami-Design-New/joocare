import { MessagePayload } from "firebase/messaging";
import { messaging, onMessage } from "@/shared/lib/firebase";

type ForegroundMessageHandler = (payload: MessagePayload) => void;

export function listenForMessages(
  onForegroundMessage?: ForegroundMessageHandler,
) {
  if (!messaging) {
    console.warn("[Notifications] Foreground listener not attached: messaging unavailable.");
    return undefined;
  }

  console.info("[Notifications] Foreground listener attached.");

  return onMessage(messaging, (payload) => {
    console.info("[Notifications] Foreground message received.", payload);
    onForegroundMessage?.(payload);
  });
}
