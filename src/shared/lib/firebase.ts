import { getApp, getApps, initializeApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import type { Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBmk2V514sINB6UOPaBsYSw4HRk1LytePI",
  authDomain: "joocare.firebaseapp.com",
  projectId: "joocare",
  storageBucket: "joocare.firebasestorage.app",
  messagingSenderId: "1031322767837",
  appId: "1:1031322767837:web:39886384ea5f7761a5e634",
  measurementId: "G-YLZXKCQVNT",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let cachedAnalytics: Analytics | null | undefined;
let cachedMessaging: Messaging | null | undefined;

export async function getFirebaseAnalytics() {
  if (cachedAnalytics !== undefined) {
    return cachedAnalytics;
  }

  if (typeof window === "undefined") {
    cachedAnalytics = null;
    return cachedAnalytics;
  }

  try {
    const analyticsModule = await import("firebase/analytics");
    const supported = await analyticsModule.isSupported().catch(() => false);

    if (!supported) {
      cachedAnalytics = null;
      return cachedAnalytics;
    }

    cachedAnalytics = analyticsModule.getAnalytics(app);
    return cachedAnalytics;
  } catch (error) {
    console.warn("[Firebase] Analytics unavailable in this environment.", error);
    cachedAnalytics = null;
    return cachedAnalytics;
  }
}

export async function getFirebaseMessaging() {
  if (cachedMessaging !== undefined) {
    return cachedMessaging;
  }

  if (typeof window === "undefined") {
    cachedMessaging = null;
    return cachedMessaging;
  }

  try {
    const messagingModule = await import("firebase/messaging");
    const supported = await messagingModule.isSupported().catch(() => false);

    if (!supported) {
      cachedMessaging = null;
      return cachedMessaging;
    }

    cachedMessaging = messagingModule.getMessaging(app);
    return cachedMessaging;
  } catch (error) {
    console.warn("[Firebase] Messaging unavailable in this environment.", error);
    cachedMessaging = null;
    return cachedMessaging;
  }
}
