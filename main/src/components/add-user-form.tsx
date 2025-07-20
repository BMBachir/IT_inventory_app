"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const departments = [
  "IT Department",
  "Data Center",
  "Finance",
  "Network Team",
  "Human Resources",
  "Marketing",
  "Operations",
  "Security",
];

const buildings = ["Building A", "Building B", "Building C", "Building D"];

export function AddUserForm() {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phoneNumber: "",
    service: "",
    bloc: "",
    position: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("New user data:", formData);

    // Reset form
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      phoneNumber: "",
      service: "",
      bloc: "",
      position: "",
    });

    setIsSubmitting(false);
    alert("User created successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Add New User
          </h1>
          <p className="text-gray-600 font-body">
            Create a new user who can be assigned IT assets
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">User Information</CardTitle>
          <CardDescription className="font-body">
            Fill in the details for the new user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID Preview */}
            {formData.employeeId && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-blue-900 font-body">
                      Employee ID Preview
                    </Label>
                    <div className="font-mono-custom text-lg font-bold text-blue-700">
                      {formData.employeeId}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Auto-generated
                  </Badge>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="font-body">
                    Employee ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange("employeeId", e.target.value)
                    }
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g., john.doe@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="font-body">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">
                Work Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service" className="font-body">
                    Service/Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("service", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select department"
                        className="font-body"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem
                          key={dept}
                          value={dept}
                          className="font-body"
                        >
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloc" className="font-body">
                    Building/Bloc <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange("bloc", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select building"
                        className="font-body"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem
                          key={building}
                          value={building}
                          className="font-body"
                        >
                          {building}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="font-body">
                  Position/Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="e.g., System Administrator"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Link href="/users">
                <Button
                  variant="outline"
                  type="button"
                  className="font-body bg-transparent"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-body"
              >
                {isSubmitting ? "Creating User..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
