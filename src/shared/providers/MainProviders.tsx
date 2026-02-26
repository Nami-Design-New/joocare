"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";
import TanstackQueryProvider from "./tanstack-query/TanstackQueryProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";

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
        <Provider store={store}>{children}</Provider>
      </TanstackQueryProvider>
    </NextIntlClientProvider>
  );
}
