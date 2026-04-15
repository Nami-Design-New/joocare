"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import NextAuthProvider from "./next-auth-provider/next-auth.provider";
import { Toaster } from "sonner";
import UnauthorizedSessionHandler from "@/features/auth/components/UnauthorizedSessionHandler";

export default function MainProviders({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale}>
      <TanstackQueryProvider>
        <NextAuthProvider>
          <Provider store={store}>
            <UnauthorizedSessionHandler />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </Provider>
        </NextAuthProvider>
      </TanstackQueryProvider>
    </NextIntlClientProvider>
  );
}
