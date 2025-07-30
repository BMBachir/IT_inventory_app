"use client";

import { useAuth } from "@/app/Context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogIn, ArrowLeft } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || !user.userData || user.userData.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="relative max-w-md w-full">
          {/* Decorative elements */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-100 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-xl"></div>

          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-8 space-y-6">
            {/* Icon with animated pulse effect */}
            <div className="mx-auto relative flex items-center justify-center">
              <div className="absolute inset-0 bg-red-100 w-[100px] mx-auto rounded-full animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-red-100 shadow-inner">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-bold  bg-clip-text bg-gradient-to-r from-red-600 to-red-800 text-transparent">
                Access Restricted
              </h1>
              <p className="text-gray-600">
                You don't have permission to access this resource. Please
                contact your system administrator if you believe this is an
                error.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In with Admin Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
