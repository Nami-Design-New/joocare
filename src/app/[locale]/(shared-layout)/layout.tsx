import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/header/Header";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="min-h-screen container mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
