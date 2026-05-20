"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { getQueryClient } from "./query-client-setup";

export default function TanstackQueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const locale = useLocale();
  const previousLocaleRef = useRef(locale);

  useEffect(() => {
    if (previousLocaleRef.current === locale) return;

    queryClient.cancelQueries();
    queryClient.clear();
    previousLocaleRef.current = locale;
  }, [locale, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
