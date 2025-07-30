"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Folder,
  FolderOpen,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const API_BASE =
  process.env.NEXT_PUBLIC_API_PORT_URL ?? "http://localhost:5001";

// API Calls
const fetchCategories = async () =>
  fetch(`${API_BASE}/api/categories`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());

const createCategorie = async (data: { nom: string }) =>
  fetch(`${API_BASE}/api/categories/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

const updateCategorie = async (code: number, data: { nom: string }) =>
  fetch(`${API_BASE}/api/categories/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

const deleteCategorie = async (id: number) =>
  fetch(`${API_BASE}/api/categories/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

const fetchSousCategories = async () =>
  fetch(`${API_BASE}/api/sous-categories`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());

const createSousCategorie = async (data: {
  nom: string;
  categorieId: number;
  code: string;
}) =>
  fetch(`${API_BASE}/api/sous-categories/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

// Types
export type Categorie = {
  id: number;
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

  const [isSousFormOpen, setIsSousFormOpen] = useState(false);
  const [editingSousCategorie, setEditingSousCategorie] =
    useState<SousCategorie | null>(null);

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

  const handleDelete = async (code: number) => {
    await deleteCategorie(code);
    await load();
  };

  const handleSousCategorieCreate = async () => {
    if (selectedCategorieId && newSousNom) {
      await createSousCategorie({
        nom: newSousNom,
        categorieId: parseInt(selectedCategorieId),
        code: newSousCode,
      });
      setNewSousNom("");
      setNewSousCode("");
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
        credentials: "include",
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
        credentials: "include",
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
  const router = useRouter();
  return (
    <ProtectedRoute>
      <div className="p-6 space-y-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 flex-shrink-0" // Added flex-shrink-0 to prevent resizing
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          {/* A div to group heading and subheading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Categories Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage all Categories, Sous-categories.
            </p>
          </div>
        </div>
        <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Categories
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {categories.length}{" "}
                  {categories.length === 1 ? "category" : "categories"}{" "}
                  available
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setEditing(null);
                  setNewNom("");
                  setOpen(true);
                }}
                className="h-10 px-6 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 max-w-md">
                  Get started by creating your first category to organize your
                  content
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.code}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Folder className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {cat.nom}
                        </span>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Code: {cat.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          setEditing(cat);
                          setNewNom(cat.nom);
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cat.code)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Category Form Dialog */}
        </Card>

        {/* Dialog for Add/Edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle className="text-lg font-semibold mb-4">
              {editing ? "Edit" : "New"} Category
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mb-4">
              Remplissez les champs ci-dessous pour créer ou modifier une
              catégorie.
            </DialogDescription>
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
        <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Manage Sub-Categories
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {sousCategories.length}{" "}
                  {sousCategories.length === 1
                    ? "sub-category"
                    : "sub-categories"}{" "}
                  available
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Create Sub-Category Form */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">
                Create New Sub-Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sous-nom">Name</Label>
                  <Input
                    id="sous-nom"
                    value={newSousNom}
                    onChange={(e) => setNewSousNom(e.target.value)}
                    placeholder="Enter sub-category name"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="select-categorie">Parent Category</Label>
                  <Select
                    value={selectedCategorieId}
                    onValueChange={(val) => setSelectedCategorieId(val)}
                  >
                    <SelectTrigger
                      id="select-categorie"
                      className="focus:ring-2 focus:ring-purple-500"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.code} value={String(cat.code)}>
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-purple-600" />
                            {cat.nom}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSousCategorieCreate}
                    className="w-full h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Sub-Category
                  </Button>
                </div>
              </div>
            </div>

            {/* List of Sub-Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <List className="h-5 w-5 text-gray-500" />
                Existing Sub-Categories
              </h3>

              {sousCategories.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
                  <FolderOpen className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h4 className="text-gray-600 font-medium">
                    No sub-categories found
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Create your first sub-category to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sousCategories.map((sousCat) => (
                    <div
                      key={sousCat.code}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Folder className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {sousCat.nom}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 font-mono">
                              Code: {sousCat.code}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              Parent:{" "}
                              {categories.find(
                                (c) => c.code === sousCat.categorieId
                              )?.nom || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 hover:bg-gray-50"
                          onClick={() => handleEditSousCategorie(sousCat)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSousCategorie(sousCat)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          {/* Edit/Create Dialog */}
          <Dialog open={isSousFormOpen} onOpenChange={setIsSousFormOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingSousCategorie ? "Edit" : "Create New"} Sub-Category
                </DialogTitle>
                <DialogDescription>
                  {editingSousCategorie
                    ? "Update the sub-category details below"
                    : "Fill out the form to create a new sub-category"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newSousNom}
                    onChange={(e) => setNewSousNom(e.target.value)}
                    placeholder="Sub-category name"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input
                    value={newSousCode}
                    onChange={(e) => setNewSousCode(e.target.value)}
                    placeholder="Sub-category code"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select
                    value={selectedCategorieId}
                    onValueChange={setSelectedCategorieId}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.code} value={String(cat.code)}>
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-purple-600" />
                            {cat.nom}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSousCategorieSave}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingSousCategorie
                    ? "Save Changes"
                    : "Create Sub-Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
