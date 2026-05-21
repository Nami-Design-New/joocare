"use client";

import { setSettings } from "@/features/settings/store/settings-slice";
import type { AppSetting } from "@/shared/services/settings-services";
import { NextIntlClientProvider } from "next-intl";
import React, { useEffect, useState } from "react";
import NextAuthProvider from "./next-auth-provider/next-auth.provider";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import UnauthorizedSessionHandler from "@/features/auth/components/UnauthorizedSessionHandler";
import { makeStore, type AppStore } from "./redux/store";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";

export default function MainProviders({
  children,
  locale,
  messages,
  initialSettings,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
  initialSettings: AppSetting | null;
}) {
  const [store] = useState<AppStore>(() =>
    makeStore({
      settings: {
        data: initialSettings,
        loaded: true,
        loading: false,
        error: null,
      },
    }),
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TanstackQueryProvider>
        <NextAuthProvider>
          <Provider store={store}>
            <UnauthorizedSessionHandler />
            <SettingsHydratorBridge
              store={store}
              initialSettings={initialSettings}
            />
            <NextTopLoader showSpinner={false} color={`var(--secondary)`} />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </Provider>
        </NextAuthProvider>
      </TanstackQueryProvider>
    </NextIntlClientProvider>
  );
}

function SettingsHydratorBridge({
  store,
  initialSettings,
}: {
  store: AppStore;
  initialSettings: AppSetting | null;
}) {
  useEffect(() => {
    store.dispatch(setSettings(initialSettings));
  }, [initialSettings, store]);

  return null;
}
