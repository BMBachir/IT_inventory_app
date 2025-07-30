"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  Compass,
  FolderOpen,
  FolderTree,
  Link2,
  MapPin,
  Monitor,
  Package,
  Plus,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type InventoryStats = {
  totalItems: number;
  totalUsers: number;
  categories: number;
  locations: number;
  activeUsers: number;
  topCategories: string[];
  primaryLocation: string;
};
type CategoryStat = {
  id: number | string;
  name: string;
  code: string;
  color: string; // e.g., "bg-blue-500"
  icon: React.ElementType; // this is key for dynamic icon components
  subCategories: string[];
  count: number;
};

function DataDashboard() {
  const [inventoryStats, setInventoryStats] = useState<InventoryStats>({
    totalItems: 0,
    totalUsers: 0,
    categories: 0,
    locations: 0,
    activeUsers: 0,
    topCategories: [],
    primaryLocation: "N/A",
  });

  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_PORT_URL}/api/dashboard/`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("data", data);
        const mappedCategories = data.categoryMaterialCounts.map(
          (cat: any) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            code: `${cat.categoryId}`,
            count: cat.materialsCount,
            icon: Monitor,
            color: "bg-blue-500",
          })
        );

        setInventoryStats({
          totalItems: data.totalMaterials,
          totalUsers: data.totalUsers,
          categories: data.totalCategories,
          locations: data.totalLocations || 0,
          activeUsers: data.activeUsers || 0,
          topCategories: data.topCategories || [],
          primaryLocation: data.primaryLocation || "N/A",
        });

        setCategoryStats(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Items Card */}
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Items
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-gray-900">
                {inventoryStats.totalItems}
              </div>
              <div className="text-sm text-green-600 flex items-center mb-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                8% from last month
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (inventoryStats.totalItems / 500) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-purple-50 to-white overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-purple-600">
                {inventoryStats.totalUsers}
              </div>
              <div className="text-sm text-blue-600 flex items-center mb-1">
                <Plus className="h-3 w-3 mr-1" />3 new this week
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                Active: {inventoryStats.activeUsers || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-green-50 to-white overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Categories
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-100">
                <Tags className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {inventoryStats.categories}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {inventoryStats.topCategories?.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                >
                  {category}
                </span>
              ))}
              {inventoryStats.categories > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{inventoryStats.categories - 2} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Locations Card */}
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-amber-50 to-white overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Locations
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-100">
                <MapPin className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {inventoryStats.locations}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Compass className="h-4 w-4" />
              <span>
                Most active: {inventoryStats.primaryLocation || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-0 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              {/* Decorative element */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-blue-600 rounded-full"></div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                    <FolderTree className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold  bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent">
                    Inventory Categories
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 pl-11">
                  Hierarchical organization of IT assets across your
                  organization
                </CardDescription>
              </div>
            </div>
            <Link href={"/categories"}>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 shadow-xs"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {categoryStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 max-w-md">
                Create your first category to organize your IT assets
              </p>
              <Link href={"/categories"}>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 shadow-xs"
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryStats.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link key={category.id} href={`/category/${category.id}`}>
                    <Card className="border-0 shadow-xs hover:shadow-md transition-all duration-300 hover:border-blue-200">
                      <CardContent className="p-5">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-xl ${category.color} text-white shadow-sm`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono mt-1">
                              {category.code}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {category.subCategories
                                ?.slice(0, 2)
                                .map((subCat) => (
                                  <span
                                    key={subCat}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                                  >
                                    {subCat}
                                  </span>
                                ))}
                              {category.subCategories?.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                                  +{category.subCategories.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 text-blue-700 px-3 py-1"
                          >
                            {category.count}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default DataDashboard;
