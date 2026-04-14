importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

console.info("[Notifications SW] Firebase messaging service worker booting.");

firebase.initializeApp({
  apiKey: "AIzaSyBmk2V514sINB6UOPaBsYSw4HRk1LytePI",
  authDomain: "joocare.firebaseapp.com",
  projectId: "joocare",
  storageBucket: "joocare.firebasestorage.app",
  messagingSenderId: "1031322767837",
  appId: "1:1031322767837:web:39886384ea5f7761a5e634",
  measurementId: "G-YLZXKCQVNT",
});

const messaging = firebase.messaging();

console.info("[Notifications SW] Firebase messaging initialized.");

messaging.onBackgroundMessage((payload) => {
  console.info("[Notifications SW] Background message received.", payload);
  const title = payload.notification?.title || "New notification";
  const body = payload.notification?.body || "";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    data: payload.data || {},
  });
});
