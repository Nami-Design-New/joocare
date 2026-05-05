import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export { getToken, onMessage };
