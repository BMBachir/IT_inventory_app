import type React from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "IT Inventory Management System",
  description: "Professional IT asset management and tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
