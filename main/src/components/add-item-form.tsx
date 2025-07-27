"use client";

import { useState, useEffect } from "react";
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
import { type User } from "@/lib/inventory";
import { toast } from "react-toastify";

// Définir les types pour les catégories et sous-catégories venant de l'API
interface Category {
  nom: string;
  code: number;
}

interface Subcategory {
  nom: string;
  code: string;
  categorieId: number;
}

// Define the structure for a specification item
interface SpecificationItem {
  id: string;
  name: string;
  type: "text" | "number";
  placeholder: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

export function AddItemForm() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [formData, setFormData] = useState({
    marque: "",
    selectedUserId: "",
    specifications: {
      cpu: "",
      ram: "",
      disk: "",
      ncpu: null as number | null,
      nram: null as number | null,
      ndisk: null as number | null,
      ecran: "",
      adf: null as number | null,
      clavier: null as number | null,
      souris: null as number | null,
      usb: null as number | null,
    },
  });

  // Define ALL possible fixed specifications
  const allFixedSpecifications: SpecificationItem[] = [
    {
      id: "cpu",
      name: "CPU",
      type: "text",
      placeholder: "e.g., Intel Core i7",
    },
    { id: "ram", name: "RAM", type: "text", placeholder: "e.g., 16GB DDR4" },
    { id: "disk", name: "Disk", type: "text", placeholder: "e.g., 512GB SSD" },
    { id: "ecran", name: "Ecran", type: "text", placeholder: "e.g., 24 inch" },
    {
      id: "ncpu",
      name: "Nombre de CPU",
      type: "number",
      placeholder: "e.g., 1",
    },
    {
      id: "nram",
      name: "Nombre de RAM",
      type: "number",
      placeholder: "e.g., 2",
    },
    {
      id: "ndisk",
      name: "Nombre de Disques",
      type: "number",
      placeholder: "e.g., 1",
    },
    {
      id: "adf",
      name: "ADF",
      type: "number",
      placeholder: "e.g., 1 (for scanner)",
    },
    { id: "clavier", name: "Clavier", type: "number", placeholder: "e.g., 1" },
    { id: "souris", name: "Souris", type: "number", placeholder: "e.g., 1" },
    { id: "usb", name: "Ports USB", type: "number", placeholder: "e.g., 4" },
  ];

  // Fetch data from APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, catRes, subRes] = await Promise.all([
          fetch(`${API_BASE}/api/users`).then((res) => res.json()),
          fetch(`${API_BASE}/api/categories`).then((res) => res.json()),
          fetch(`${API_BASE}/api/sous-categories`).then((res) => res.json()),
        ]);

        setUsers(userRes);
        setCategories(catRes);
        setSubcategories(subRes);
      } catch (err) {
        console.error("Impossible de charger les données:", err);
      }
    };
    fetchData();
  }, []);

  // Filter subcategories based on the selected category
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((s) => s.categorieId === selectedCategory)
    : [];

  // Find the selected user, category, and subcategory from the fetched data
  const selectedUser = users.find(
    (u) => String(u.id) === formData.selectedUserId
  );
  const category = selectedCategory
    ? categories.find((c) => c.code === selectedCategory)
    : null;
  const subcategory = selectedSubcategory
    ? subcategories.find((s) => Number(s.code) === selectedSubcategory)
    : null;

  // Function to determine which specifications to render based on category/subcategory
  const getSpecsToRender = (): SpecificationItem[] => {
    if (!category) {
      return []; // No category selected, no specs to show
    }

    if (category.nom === "Computer") {
      if (subcategory?.nom === "Server") {
        // For Computer -> Server, show all specs
        return allFixedSpecifications;
      } else {
        // For Computer -> Other Subcategory (not Server), show all except Ncpu, Nram, Ndisk
        return allFixedSpecifications.filter(
          (spec) => !["ncpu", "nram", "ndisk"].includes(spec.id)
        );
      }
    } else if (category.nom === "Imagerie") {
      if (subcategory?.nom === "Scanner") {
        // For Imagerie -> Scanner, show only ADF
        return allFixedSpecifications.filter((spec) => spec.adf === "adf");
      }
    }

    // Default: if no specific rule matches, show all specs (or adjust as needed)
    return allFixedSpecifications;
  };

  const specsToDisplay = getSpecsToRender();

  // Handle changes in dynamic specifications
  const handleSpecificationChange = (specId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specId]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the payload to match the 'material' table schema
    const payload = {
      marque: formData.marque,
      cpu: formData.specifications.cpu || null, // Ensure empty strings are sent as null for varchar
      ram: formData.specifications.ram || null,
      disk: formData.specifications.disk || null,
      Ncpu: formData.specifications.ncpu,
      Nram: formData.specifications.nram,
      Ndisk: formData.specifications.ndisk,
      ecran: formData.specifications.ecran || null,
      adf: formData.specifications.adf,
      clavier: formData.specifications.clavier,
      souris: formData.specifications.souris,
      usb: formData.specifications.usb,
      userId: Number(formData.selectedUserId),
      sousCategorieId: selectedSubcategory?.toString() || null,
      categorieId: selectedCategory,
    };

    try {
      const res = await fetch(`${API_BASE}/api/materials/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create asset");
      const result = await res.json();
      console.log("Asset created:", result);
      toast.success("material ajoute avec succes");
      // Reset the form after successful submission
      setFormData({
        marque: "",
        selectedUserId: "",
        specifications: {
          cpu: "",
          ram: "",
          disk: "",
          ncpu: null,
          nram: null,
          ndisk: null,
          ecran: "",
          adf: null,
          clavier: null,
          souris: null,
          usb: null,
        },
      });

      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Add New IT Asset</CardTitle>
            <CardDescription className="font-body">
              Register a new item in the inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category and User Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-body" htmlFor="assignedUser">
                  Assign to User <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.selectedUserId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      selectedUserId: value,
                    }))
                  }
                  required
                >
                  <SelectTrigger id="assignedUser">
                    <SelectValue placeholder="Select user to assign this asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        <div className="flex flex-col">
                          <span>{user.fullname}</span>
                          <span className="text-xs text-gray-500">
                            {user.service}-{user.id}
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
                  value={selectedCategory?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedCategory(Number(value));
                    setSelectedSubcategory(null); // Reset subcategory when category changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.code} value={cat.code.toString()}>
                        {cat.code} - {cat.nom}
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
                  value={selectedSubcategory?.toString() || ""}
                  disabled={
                    !selectedCategory || filteredSubcategories.length === 0
                  }
                  onValueChange={(value) =>
                    setSelectedSubcategory(Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((subcat) => (
                      <SelectItem
                        key={subcat.code}
                        value={subcat.code.toString()}
                      >
                        {subcat.code} - {subcat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* New Technical Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">
                Technical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marque Input */}
                <div className="space-y-2">
                  <Label htmlFor="marque" className="font-body">
                    Marque
                  </Label>
                  <Input
                    id="marque"
                    value={formData.marque}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        marque: e.target.value,
                      }))
                    }
                    placeholder="e.g., Dell, HP, Lenovo"
                  />
                </div>
              </div>

              {/* Dynamic Specifications */}
              {specsToDisplay.length > 0 && ( // Only render if there are specs to display
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specsToDisplay.map((spec) => (
                    <div key={spec.id} className="space-y-2">
                      <Label htmlFor={spec.id} className="font-body">
                        {spec.name}
                      </Label>
                      {spec.type === "text" && (
                        <Input
                          id={spec.id}
                          value={formData.specifications[spec.id] || ""}
                          onChange={(e) =>
                            handleSpecificationChange(spec.id, e.target.value)
                          }
                          placeholder={spec.placeholder}
                        />
                      )}
                      {spec.type === "number" && (
                        <Input
                          id={spec.id}
                          type="number"
                          value={
                            formData.specifications[spec.id] === null
                              ? ""
                              : formData.specifications[spec.id]
                          }
                          onChange={(e) =>
                            handleSpecificationChange(
                              spec.id,
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                          placeholder={spec.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Add Asset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
