"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  INVENTORY_STRUCTURE,
  generateMaterialCode,
  type User,
} from "@/lib/inventory";

// Add mock users data at the top
const mockUsers: User[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    phoneNumber: "+1234567890",
    service: "IT Department",
    bloc: "Building A",
    position: "System Administrator",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock users...
];

export function AddItemForm() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    model: "",
    selectedUserId: "", // Add this
    specifications: {} as { [key: string]: any },
  });

  const category = selectedCategory
    ? INVENTORY_STRUCTURE.find((c) => c.id === selectedCategory)
    : null;
  const subcategory =
    selectedSubcategory && category
      ? category.subcategories.find((s) => s.id === selectedSubcategory)
      : null;

  // Generate preview code
  const previewCode =
    category && subcategory
      ? generateMaterialCode(category.code, subcategory.code.split(".")[1], 1)
      : "";

  const handleSpecificationChange = (specId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specId]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Add New IT Asset</CardTitle>
          <CardDescription className="font-body">
            Register a new item in the inventory management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 ">
            <div className="space-y-2">
              <Label htmlFor="assignedUser" className="font-body">
                Assign to User <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedUserId: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user to assign this asset" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers
                    .filter((user) => user.isActive)
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">
                            {user.service} - {user.employeeId}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="font-body">
                Category
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedCategory(Number(value));
                  setSelectedSubcategory(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_STRUCTURE.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.code} - {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory" className="font-body">
                Subcategory
              </Label>
              <Select
                disabled={!selectedCategory}
                onValueChange={(value) => setSelectedSubcategory(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {category?.subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                      {subcat.code} - {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generated Code Preview */}
          {previewCode && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-blue-900 font-body">
                    Generated Code Preview
                  </Label>
                  <div className="font-mono-custom text-lg font-bold text-blue-700">
                    {previewCode}
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">
                  Auto-generated
                </Badge>
              </div>
            </div>
          )}

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body">
                  Asset Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Dell OptiPlex 7090"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="font-body">
                  Brand
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  placeholder="e.g., Dell"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model" className="font-body">
                  Model
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, model: e.target.value }))
                  }
                  placeholder="e.g., OptiPlex 7090"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-body">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Detailed description of the asset"
                rows={3}
              />
            </div>
          </div>

          {/* User Assignment */}

          <Separator />

          {/* Dynamic Specifications */}
          {subcategory && subcategory.specifications.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-heading">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subcategory.specifications.map((spec) => (
                    <div key={spec.id} className="space-y-2">
                      <Label htmlFor={spec.id} className="font-body">
                        {spec.name}
                        {spec.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                        {spec.unit && (
                          <span className="text-gray-500 ml-1">
                            ({spec.unit})
                          </span>
                        )}
                      </Label>
                      {spec.type === "text" && (
                        <Input
                          id={spec.id}
                          value={formData.specifications[spec.id] || ""}
                          onChange={(e) =>
                            handleSpecificationChange(spec.id, e.target.value)
                          }
                          placeholder={`Enter ${spec.name.toLowerCase()}`}
                          required={spec.required}
                        />
                      )}
                      {spec.type === "number" && (
                        <Input
                          id={spec.id}
                          type="number"
                          value={formData.specifications[spec.id] || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              spec.id,
                              Number(e.target.value)
                            )
                          }
                          placeholder={`Enter ${spec.name.toLowerCase()}`}
                          required={spec.required}
                        />
                      )}
                      {spec.type === "select" && spec.options && (
                        <Select
                          onValueChange={(value) =>
                            handleSpecificationChange(spec.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`Select ${spec.name.toLowerCase()}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {spec.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {spec.type === "boolean" && (
                        <Select
                          onValueChange={(value) =>
                            handleSpecificationChange(spec.id, value === "true")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`Select ${spec.name.toLowerCase()}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Add Asset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
