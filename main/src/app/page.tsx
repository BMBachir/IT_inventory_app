"use client";

import { Button } from "@/components/ui/button";

import {
  Users,
  UserPlus,
  Scan,
  LogIn,
  History,
  Tags,
  LogOut,
  Server,
} from "lucide-react";
import Link from "next/link";

import RecentItem from "@/components/recent-item";
import DataDashboard from "@/components/DataDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

export default function Dashboard() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("user");
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header - Maintained same layout structure */}
          <div className="relative">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100 rounded-full opacity-5 blur-3xl"></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative">
              {/* Title Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                    <Server className="h-5 w-5 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent">
                    IT Inventory Management
                  </h1>
                </div>
                <p className="text-gray-600 pl-11">
                  Professional Asset Management System with User Assignment
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/history">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-xs backdrop-blur-sm"
                  >
                    <History className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Action History</span>
                  </Button>
                </Link>
                <Link href="/scanner">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-xs backdrop-blur-sm"
                  >
                    <Scan className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Scanner</span>
                  </Button>
                </Link>
                <Link href="/users">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-xs backdrop-blur-sm"
                  >
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Users</span>
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-xs backdrop-blur-sm"
                  >
                    <Tags className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Categories</span>
                  </Button>
                </Link>
                <Link href="/add-user">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-xs backdrop-blur-sm"
                  >
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Add User</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm backdrop-blur-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Unchanged layout */}
          <DataDashboard />
          <RecentItem />
        </div>
      </div>
    </ProtectedRoute>
  );
}
