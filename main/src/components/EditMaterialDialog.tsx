"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Specifications = {
  cpu: string;
  ram: string;
  disk: string;
  ncpu: number | null;
  nram: number | null;
  ndisk: number | null;
  ecran: string;
  adf: number | null;
  clavier: string | null;
  souris: string | null;
  usb: string | null;
  [key: string]: string | number | null; // 👈 Add this
};

type MaterialFormData = {
  marque: string;
  selectedUserId: string;
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  specifications: Specifications;
};

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;
export default function EditMaterialDialog({
  open,
  onClose,
  material,
  onUpdated,
  users,
  categories,
  subcategories,
}: {
  open: boolean;
  onClose: () => void;
  material: any;
  onUpdated: () => void;

  users: any[];
  categories: any[];
  subcategories: any[];
}) {
  const [formData, setFormData] = useState<MaterialFormData>({
    marque: "",
    selectedUserId: "",
    selectedCategoryId: null,
    selectedSubcategoryId: null,
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

  useEffect(() => {
    if (material) {
      setFormData({
        marque: material.marque || "",
        selectedUserId: material.userId?.toString() || "",
        selectedCategoryId: material.categorieId || null,
        selectedSubcategoryId: material.sousCategorieId || null,
        specifications: {
          cpu: material.cpu || "",
          ram: material.ram || "",
          disk: material.disk || "",
          ncpu: material.Ncpu ?? null,
          nram: material.Nram ?? null,
          ndisk: material.Ndisk ?? null,
          ecran: material.ecran || "",
          adf: material.adf ?? null,
          clavier: material.clavier ?? null,
          souris: material.souris ?? null,
          usb: material.usb ?? null,
        },
      });
    }
  }, [material]);

  const handleSpecificationChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      marque: formData.marque,
      userId: formData.selectedUserId,
      categorieId: formData.selectedCategoryId,
      sousCategorieId: formData.selectedSubcategoryId,
      ...formData.specifications,
    };

    try {
      const res = await fetch(
        `${API_BASE}/api/materials/update/${material.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to update material");

      toast.success("Matériel mis à jour");
      onClose();
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const filteredSubcategories = (subcategories || []).filter(
    (sub) => sub.categorieId === formData.selectedCategoryId
  );

  const specsToDisplay = [
    { id: "cpu", name: "CPU", type: "text", placeholder: "Intel i5, Ryzen 7" },
    { id: "ram", name: "RAM", type: "text", placeholder: "8GB, 16GB" },
    { id: "disk", name: "Disque", type: "text", placeholder: "256GB SSD" },
    { id: "ncpu", name: "# CPU", type: "number", placeholder: "1" },
    { id: "nram", name: "# RAM", type: "number", placeholder: "2" },
    { id: "ndisk", name: "# Disques", type: "number", placeholder: "1" },
    { id: "ecran", name: "Écran", type: "text", placeholder: "15.6''" },
    { id: "adf", name: "ADF", type: "boolean" },
    { id: "clavier", name: "Clavier", type: "number", placeholder: "1" },
    { id: "souris", name: "Souris", type: "number", placeholder: "1" },
    { id: "usb", name: "Ports USB", type: "number", placeholder: "4" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier Matériel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.selectedCategoryId?.toString() || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    selectedCategoryId: Number(value),
                    selectedSubcategoryId: null,
                  }));
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
                value={formData.selectedSubcategoryId?.toString() || ""}
                disabled={
                  !formData.selectedCategoryId ||
                  filteredSubcategories.length === 0
                }
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedSubcategoryId: Number(value),
                  }))
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading">
              Technical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                const specValue = formData.specifications[spec.id] ?? null;

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
                        onValueChange={(value: string) =>
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
                        value={formData.specifications[spec.id] || ""}
                        onChange={(e) =>
                          handleSpecificationChange(spec.id, e.target.value)
                        }
                        placeholder={spec.placeholder}
                      />
                    ) : (
                      <Input
                        id={spec.id}
                        type="number"
                        value={specValue !== null ? specValue : ""}
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
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
