"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Scan, LogIn, Tags } from "lucide-react";
import Link from "next/link";

import { AddItemForm } from "@/components/add-item-form";

import RecentItem from "@/components/recent-item";
import DataDashboard from "@/components/DataDashboard";
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              IT Inventory Management
            </h1>
            <p className="text-gray-600 font-body">
              Professional Asset Management System with User Assignment
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/scanner">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-body"
              >
                <Scan className="h-4 w-4" />
                Barcode Scanner
              </Button>
            </Link>
            <Link href="/users">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-body"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-body"
              >
                <Tags className="h-4 w-4" />
                Categories
              </Button>
            </Link>

            <Link href="/add-user">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-body"
              >
                <UserPlus className="h-4 w-4" />
                Add IT User
              </Button>
            </Link>
            <Link href="/login">
              <Button className="flex items-center gap-2 font-body">
                <LogIn className="h-4 w-4" />
                Log out
              </Button>
            </Link>
          </div>
        </div>

        <DataDashboard />
        <RecentItem />
      </div>
    </div>
  );
}
