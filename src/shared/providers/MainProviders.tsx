"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import NextAuthProvider from "./next-auth-provider/next-auth.provider";
import { Toaster } from "sonner";

export default function MainProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TanstackQueryProvider>
        <NextAuthProvider>
          <Provider store={store}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </Provider>
        </NextAuthProvider>
      </TanstackQueryProvider>
    </NextIntlClientProvider>
  );
}
