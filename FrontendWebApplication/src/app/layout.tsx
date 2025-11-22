import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "./ClientProvider";

export const metadata: Metadata = {
  title: "Chat App with Tagging",
  description: "WhatsApp-style tagging with dynamic autocomplete",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="app">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
