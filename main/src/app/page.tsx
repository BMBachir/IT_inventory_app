import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Computer,
  Monitor,
  Network,
  Radio,
  Zap,
  Camera,
  Users,
  UserPlus,
  Scan,
  LogIn,
  Tags,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddItemForm } from "@/components/add-item-form";
const inventoryStats = {
  totalItems: 1247,
  totalUsers: 156,
  categories: 6,
  locations: 12,
  pendingMaintenance: 8,
};

const categoryStats = [
  {
    id: 1,
    name: "Computer",
    icon: Computer,
    count: 450,
    code: "1",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Imaging",
    icon: Camera,
    count: 120,
    code: "2",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Monitoring",
    icon: Monitor,
    count: 200,
    code: "3",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Network",
    icon: Network,
    count: 180,
    code: "4",
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Communication",
    icon: Radio,
    count: 95,
    code: "5",
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Energy",
    icon: Zap,
    count: 202,
    code: "6",
    color: "bg-yellow-500",
  },
];

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

        {/* Recent Items with User Assignment */}
        <Card>
          <CardHeader>
            <div className="justify-between flex flex-row">
              <div>
                <CardTitle className="font-heading">Recent Items</CardTitle>
                <CardDescription className="font-body">
                  Latest additions to inventory with user assignments
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent font-body"
                  >
                    <Plus className="h-4 w-4" />
                    Materials
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] max-h-[100vh] overflow-y-auto">
                  <AddItemForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <RecentItem />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
