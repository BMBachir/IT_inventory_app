import type React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <body>
        <AuthProvider>
          <>
            <main className="md:p-8">{children}</main>
            <ToastContainer />
          </>
        </AuthProvider>
      </body>
    </html>
  );
}
