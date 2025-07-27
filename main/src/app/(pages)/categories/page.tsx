"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const API_BASE =
  process.env.NEXT_PUBLIC_API_PORT_URL ?? "http://localhost:5001";

// API Calls
const fetchCategories = async () =>
  fetch(`${API_BASE}/api/categories`).then((res) => res.json());

const createCategorie = async (data: { nom: string }) =>
  fetch(`${API_BASE}/api/categories/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const updateCategorie = async (id: number, data: { nom: string }) =>
  fetch(`${API_BASE}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const deleteCategorie = async (id: number) =>
  fetch(`${API_BASE}/api/categories/delete/${id}`, {
    method: "DELETE",
  });

const fetchSousCategories = async () =>
  fetch(`${API_BASE}/api/sous-categories`).then((res) => res.json());

const createSousCategorie = async (data: {
  nom: string;
  categorieId: number;
}) =>
  fetch(`${API_BASE}/api/sous-categories/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// Types
export type Categorie = {
  code: number;
  nom: string;
};

export type SousCategorie = {
  id: number;
  code: string;
  nom: string;
  categorieId: number;
  categorie?: Categorie;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);

  const [newNom, setNewNom] = useState("");
  const [editing, setEditing] = useState<Categorie | null>(null);
  const [open, setOpen] = useState(false);

  const [newSousNom, setNewSousNom] = useState("");
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("");

  const [editingSousCategorie, setEditingSousCategorie] =
    useState<SousCategorie | null>(null);
  const [isSousFormOpen, setIsSousFormOpen] = useState(false);

  const load = async () => {
    setCategories(await fetchCategories());
    setSousCategories(await fetchSousCategories());
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (editing) await updateCategorie(editing.code, { nom: newNom });
    else await createCategorie({ nom: newNom });
    setOpen(false);
    setNewNom("");
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    await deleteCategorie(id);
    await load();
  };

  const handleSousCategorieCreate = async () => {
    if (selectedCategorieId && newSousNom) {
      await createSousCategorie({
        nom: newSousNom,
        categorieId: parseInt(selectedCategorieId),
      });
      setNewSousNom("");
      setSelectedCategorieId("");
      await load();
    }
  };

  // Update Sous-Catégorie
  const updateSousCategorie = async (
    id: number,
    data: { nom: string; categorieId: number; code: string }
  ) => {
    const response = await fetch(
      `${API_BASE}/api/sous-categories/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  };
  const [newSousCode, setNewSousCode] = useState("");

  // Delete Sous-Catégorie
  const deleteSousCategorie = async (code: string) => {
    const response = await fetch(
      `${API_BASE}/api/sous-categories/delete/${code}`,
      {
        method: "DELETE",
      }
    );
    load();
    return response.json();
  };

  const handleEditSousCategorie = (sousCat: SousCategorie) => {
    setEditingSousCategorie(sousCat);
    setNewSousNom(sousCat.nom);
    setSelectedCategorieId(String(sousCat.categorieId));
    setEditingSousCategorie(sousCat);
    setIsSousFormOpen(true);
  };

  const handleDeleteSousCategorie = async (sousCat: SousCategorie) => {
    const confirmed = confirm(`Supprimer ${sousCat.nom} ?`);
    if (!confirmed) return;

    await deleteSousCategorie(sousCat.code);

    fetchSousCategories(); // Refresh
  };
  const handleSousCategorieSave = async () => {
    if (!newSousNom || !selectedCategorieId) return;

    const data = {
      nom: newSousNom,
      categorieId: parseInt(selectedCategorieId),
    };

    if (editingSousCategorie) {
      await updateSousCategorie(editingSousCategorie.id, {
        nom: newSousNom,
        categorieId: Number(selectedCategorieId),
        code: newSousCode,
      });
    } else {
      await createSousCategorie({
        nom: newSousNom,
        categorieId: Number(selectedCategorieId),
        code: newSousCode,
      });
    }

    setNewSousNom("");
    setSelectedCategorieId("");
    setEditingSousCategorie(null);
    setIsSousFormOpen(false);
    await load();
  };

  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto">
      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Categories</CardTitle>
          <Button onClick={() => setOpen(true)}>+ Add Category</Button>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.code}
                className="flex justify-between items-center border p-3 rounded-md"
              >
                <span className="font-medium">{cat.nom}</span>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditing(cat);
                      setNewNom(cat.nom);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat.code)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit" : "New"} Category
          </h2>
          <div className="space-y-4">
            <Label htmlFor="nom">Category Name</Label>
            <Input
              id="nom"
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              placeholder="Enter category name"
            />
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sous-Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Manage Sous-Categories</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          {/* Sous-Category Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="sous-nom">Sous-Categorie Name</Label>
              <Input
                id="sous-nom"
                value={newSousNom}
                onChange={(e) => setNewSousNom(e.target.value)}
                placeholder="Enter sous-categorie name"
              />
            </div>
            <div>
              <Label htmlFor="select-categorie">Category</Label>
              <Select
                value={selectedCategorieId}
                onValueChange={(val) => setSelectedCategorieId(val)}
              >
                <SelectTrigger id="select-categorie">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.code} value={String(cat.code)}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSousCategorieCreate}>
              Create Sous-Categorie
            </Button>
          </div>

          {/* List of Sous-Categories */}
          <div className="space-y-2">
            <h3 className="font-semibold text-md mb-1">
              Existing Sous-Categories
            </h3>
            {sousCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sous-categories yet.
              </p>
            ) : (
              sousCategories.map((sousCat) => (
                <div
                  key={sousCat.code}
                  className="flex justify-between items-center"
                >
                  <div>
                    {sousCat.nom} ({sousCat.code})
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditSousCategorie(sousCat)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSousCategorie(sousCat)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Dialog open={isSousFormOpen} onOpenChange={setIsSousFormOpen}>
              <DialogContent>
                <h2 className="text-lg font-semibold mb-2">
                  {editingSousCategorie ? "Modifier" : "Nouvelle"}{" "}
                  Sous-Catégorie
                </h2>
                <Input
                  value={newSousNom}
                  onChange={(e) => setNewSousNom(e.target.value)}
                  placeholder="Nom de la sous-catégorie"
                />
                <Input
                  value={newSousCode}
                  onChange={(e) => setNewSousCode(e.target.value)}
                  placeholder="Code de la sous-catégorie"
                />

                <Select
                  value={selectedCategorieId}
                  onValueChange={setSelectedCategorieId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.code} value={String(cat.code)}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSousCategorieSave}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
