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
import { Monitor } from "lucide-react";
import Link from "next/link";

function DataDashboard() {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    categories: 0,
    locations: 0,
  });

  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_PORT_URL}/api/dashboard/`
        );
        const data = await res.json();
        console.log("data", data);
        const mappedCategories = data.categoryMaterialCounts.map((cat) => ({
          id: cat.categoryId,
          name: cat.categoryName,
          code: `${cat.categoryId}`,
          count: cat.materialsCount,
          icon: Monitor,
          color: "bg-blue-500",
        }));

        setInventoryStats({
          totalItems: data.totalMaterials,
          totalUsers: data.totalUsers,
          categories: data.totalCategories,
          locations: 0,
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
      </div>

      <Card className="mt-6">
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
    </>
  );
}

export default DataDashboard;
