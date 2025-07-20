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
} from "lucide-react";
import Link from "next/link";

// Mock data with user assignments
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

const recentItems = [
  {
    code: "1.1.001",
    name: "Dell OptiPlex 7090",
    category: "Computer > Central Unit",
    status: "Active",
    assignedUser: "John Doe",
    service: "IT Department",
  },
  {
    code: "1.2.045",
    name: "HP ProLiant DL380",
    category: "Computer > Rack Server",
    status: "Active",
    assignedUser: "Sarah Wilson",
    service: "Data Center",
  },
  {
    code: "3.1.012",
    name: 'Samsung 27" Monitor',
    category: "Monitoring > Display",
    status: "Maintenance",
    assignedUser: "Mike Johnson",
    service: "Finance",
  },
  {
    code: "4.1.008",
    name: "Cisco Catalyst 2960",
    category: "Network > Switch",
    status: "Active",
    assignedUser: "Lisa Chen",
    service: "Network Team",
  },
];

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
            <Link href="/users/add">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent font-body"
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </Link>
            <Link href="/add-item">
              <Button className="flex items-center gap-2 font-body">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-heading">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">
                {inventoryStats.totalItems}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-heading">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 font-heading">
                {inventoryStats.totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-heading">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">
                {inventoryStats.categories}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-heading">
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">
                {inventoryStats.locations}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-heading">
                Pending Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 font-heading">
                {inventoryStats.pendingMaintenance}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Inventory Categories</CardTitle>
            <CardDescription className="font-body">
              Hierarchical organization of IT assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link key={category.id} href={`/category/${category.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${category.color} text-white`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold font-heading">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-body">
                              Code: {category.code}
                            </p>
                          </div>
                          <Badge variant="secondary" className="font-body">
                            {category.count}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Items with User Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Items</CardTitle>
            <CardDescription className="font-body">
              Latest additions to inventory with user assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium font-heading">{item.name}</div>
                    <div className="text-sm text-gray-600 font-body">
                      {item.category}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs font-body">
                        👤 {item.assignedUser}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-body">
                        🏢 {item.service}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="font-mono-custom text-xs"
                    >
                      {item.code}
                    </Badge>
                    <Badge
                      variant={
                        item.status === "Active" ? "default" : "destructive"
                      }
                      className="text-xs font-body"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
