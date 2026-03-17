import Header from "@/shared/components/header/Header";
import React from "react";
import { Footer } from "react-day-picker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main> <Footer />
    </>
  );
}
