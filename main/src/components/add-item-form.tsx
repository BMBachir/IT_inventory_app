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
import { Separator } from "@/components/ui/separator";
import { type User } from "@/lib/inventory";
import { toast } from "react-toastify";

// Combobox imports
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";

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
type Specifications = {
  cpu: string;
  ram: string;
  disk: string;
  ncpu: number | null;
  nram: number | null;
  ndisk: number | null;
  ecran: string;
  adf: number | null;
  clavier: number | null;
  souris: string;
  usb: string;
};

type SpecKey = keyof Specifications;

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

interface AddItemFormProps {
  onAdded?: () => void;
  onClose?: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  onAdded,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [open, setOpen] = useState(false);

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
      souris: "",
      usb: "",
      accessoire: "",
      notes: "",
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
      placeholder: "e.g.,yes (for scanner)",
    },
    { id: "clavier", name: "Clavier", type: "number", placeholder: "e.g., 1" },
    { id: "souris", name: "Souris", type: "text", placeholder: "e.g., 1" },
    //{ id: "usb", name: "Ports USB", type: "text", placeholder: "e.g., 4" },
  ];

  // Fetch data from APIs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, catRes, subRes] = await Promise.all([
          fetch(`${API_BASE}/api/users`, {
            method: "GET",
            credentials: "include",
          }).then((res) => res.json()),
          fetch(`${API_BASE}/api/categories`, {
            method: "GET",
            credentials: "include",
          }).then((res) => res.json()),
          fetch(`${API_BASE}/api/sous-categories`, {
            method: "GET",
            credentials: "include",
          }).then((res) => res.json()),
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

  const selectedUser = users.find(
    (u) => String(u.id) === formData.selectedUserId
  );
  const category = selectedCategory
    ? categories.find((c) => c.code === selectedCategory)
    : null;
  const subcategory = selectedSubcategory
    ? subcategories.find((s) => Number(s.code) === selectedSubcategory)
    : null;

  const getSpecsToRender = (): SpecificationItem[] => {
    if (!category || !subcategory) return [];

    // CAS 1 : Computer > Server
    if (
      category.nom.toUpperCase() === "COMPUTER" &&
      subcategory.nom.toUpperCase().startsWith("SERVER")
    ) {
      return allFixedSpecifications.filter(
        (spec) =>
          !["adf", "clavier", "souris", "usb", "ecran"].includes(spec.id)
      );
    }

    // CAS 2 : Computer > Laptop
    if (
      category.nom.toUpperCase() === "COMPUTER" &&
      subcategory.nom.toUpperCase() === "LAPTOP"
    ) {
      return allFixedSpecifications.filter(
        (spec) => !["ncpu", "nram", "ndisk", "adf"].includes(spec.id)
      );
    }

    // CAS 3 : Imagerie > Scanner
    if (
      (category.nom.toUpperCase() === "IMAGERIE" &&
        subcategory.nom.toUpperCase() === "SCANNER") ||
      category.nom.toUpperCase() === "IMAGERIE"
    ) {
      return allFixedSpecifications.filter((spec) => spec.id === "adf");
    }
    if (
      category.nom.toUpperCase() === "MONITORING" ||
      category.nom.toUpperCase() === "NETWORK" ||
      category.nom.toUpperCase() === "COMMUNICATION" ||
      category.nom.toUpperCase() === "ENERGIE"
    ) {
      return allFixedSpecifications.filter((spec) => spec.id === "marque");
    }

    // CAS PAR DÉFAUT : tout afficher
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
      cpu: formData.specifications.cpu || null,
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
      accessoire: formData.specifications.accessoire || null,
      notes: formData.specifications.notes || null,
      userId: Number(formData.selectedUserId),
      sousCategorieId: selectedSubcategory || null,
      categorieId: selectedCategory,
    };

    try {
      const res = await fetch(`${API_BASE}/api/materials/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
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
          souris: "",
          usb: "",
          accessoire: "",
          notes: "",
        },
      });

      setSelectedCategory(null);
      setSelectedSubcategory(null);
      if (onAdded) onAdded();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };
  console.log("accessoire", formData.specifications);
  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto space-y-6">
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
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {formData.selectedUserId
                        ? users.find(
                            (user) =>
                              user.id.toString() === formData.selectedUserId
                          )?.fullname
                        : "Select user to assign this asset..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.fullname}
                              onSelect={(currentValue) => {
                                const selectedUser = users.find(
                                  (u) =>
                                    u.fullname.toLowerCase() ===
                                    currentValue.toLowerCase()
                                );
                                if (selectedUser) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    selectedUserId: selectedUser.id.toString(),
                                  }));
                                }
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.selectedUserId === user.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{user.fullname}</span>
                                <span className="text-xs text-gray-500">
                                  {user.service} - {user.id}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specsToDisplay.map((spec) => {
                  const specKey = spec.id as keyof Specifications;

                  return (
                    <div key={spec.id} className="space-y-1">
                      <Label
                        htmlFor={spec.id}
                        className="text-sm font-medium text-gray-700"
                      >
                        {spec.name}
                      </Label>

                      {spec.id === "adf" ? (
                        <Select
                          value={
                            formData.specifications.adf === null
                              ? ""
                              : formData.specifications.adf === 1
                              ? "yes"
                              : "no"
                          }
                          onValueChange={(value) =>
                            handleSpecificationChange(
                              "adf",
                              value === "yes" ? 1 : 0
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="ADF disponible ?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : spec.type === "text" ? (
                        <Input
                          id={spec.id}
                          value={formData.specifications[specKey] || ""}
                          onChange={(e) =>
                            handleSpecificationChange(specKey, e.target.value)
                          }
                          placeholder={spec.placeholder}
                        />
                      ) : (
                        <Input
                          id={spec.id}
                          type="number"
                          value={
                            formData.specifications[specKey] === null
                              ? ""
                              : formData.specifications[specKey]
                          }
                          onChange={(e) =>
                            handleSpecificationChange(
                              specKey,
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                          placeholder={spec.placeholder}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Accessoires */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Accessoires
                </Label>
                <Textarea
                  placeholder="Liste des accessoires..."
                  value={formData.specifications.accessoire || ""}
                  onChange={(e) =>
                    handleSpecificationChange("accessoire", e.target.value)
                  }
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Notes
                </Label>
                <Textarea
                  placeholder="Ajouter des notes..."
                  value={formData.specifications.notes || ""}
                  onChange={(e) =>
                    handleSpecificationChange("notes", e.target.value)
                  }
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
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
                      souris: "",
                      usb: "",
                      accessoire: "",
                      notes: "",
                    },
                  });
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);

                  if (onClose) onClose(); // close dialog if parent provides it
                }}
              >
                Cancel
              </Button>

              <Button type="submit">Add Asset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
