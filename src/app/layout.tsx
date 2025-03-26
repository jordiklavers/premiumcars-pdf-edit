import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PDF Editor",
  description: "Create and edit PDFs online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
