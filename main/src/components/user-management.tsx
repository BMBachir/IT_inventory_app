"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit3,
  Trash2,
  ArrowLeft,
  UserPlus,
  Search,
  Users,
  Plus,
  AlertTriangle,
  User,
  Building2,
  ArrowUp,
  Package,
  Smartphone,
  Laptop,
  Barcode,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import PdfDownloadButton from "./pdf/PdfDownloadButton";

const userSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().optional().or(z.literal("")),
  tel: z.string().optional().or(z.literal("")),
  service: z.enum([
    "PROD",
    "SUPPLY",
    "IT",
    "MG",
    "HR",
    "TECH",
    "COMM",
    "MRK",
    "DFC",
    "HSE",
    "SECRT",
    "QUALITE",
    "CERTILAB",
  ]),
  bloc: z.enum([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "H1",
    "H2",
    "H3",
    "H4",
  ]),
});

const serviceOptions = [
  "PROD",
  "SUPPLY",
  "IT",
  "MG",
  "HR",
  "TECH",
  "COMM",
  "MRK",
  "DFC",
  "HSE",
  "SECRT",
  "QUALITE",
  "CERTILAB",
];
const blocOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "H1",
  "H2",
  "H3",
  "H4",
];

interface Categorie {
  id: number;
  nom: string;
}

interface SousCategorie {
  id: number;
  nom: string;
  categorie?: Categorie;
}

export interface Material {
  id: number;
  codebar: string;
  marque: string;
  cpu?: string;
  ram?: string;
  disk?: string;
  Ncpu?: number;
  Nram?: number;
  Ndisk?: number;
  ecran?: string;
  adf?: number; // add this
  clavier?: number;
  souris?: string;
  usb?: string;
  accessoire?: string;
  notes?: string;
  SousCategorie?: SousCategorie;
}

export interface User {
  id: string;
  fullname: string;
  email?: string;
  tel?: string;
  service: string;
  bloc: string;
  createdAt: string;
  updatedAt?: string;
}
interface PdfGeneratorProps {
  user: User;
  materials: Material[];
}
export function UserManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

  type UserFormData = z.infer<typeof userSchema>;

  type User = UserFormData & {
    id: string;
    createdAt: string;
    updatedAt?: string;
  };

  const [selectedService, setSelectedService] = useState("");
  const [selectedBloc, setSelectedBloc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isMaterialsDialogOpen, setIsMaterialsDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  // Pagination state and handlers

  const itemsPerPage = 10;
  const pageRange = 5;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      email: "",
      tel: "",
      service: "IT",
      bloc: "1",
    },
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      const url = editingUser
        ? `${API_BASE}/api/users/update/${editingUser.id}`
        : `${API_BASE}/api/users/create`;
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save user");

      await fetchUsers();
      setIsFormOpen(false);
      setEditingUser(null);
      form.reset();
    } catch (err) {
      console.error("Failed to submit user:", err);
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    form.reset({ fullname: "", email: "", tel: "", service: "IT", bloc: "1" });
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset(user);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/users/delete/${selectedUser.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");

      await fetchUsers();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Pagination logic
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = [user.fullname, user.email, user.service]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // A filter matches if selectedService is "all" OR the user's service matches
    const matchesService =
      selectedService === "" ||
      selectedService === "all" ||
      user.service === selectedService;

    // A filter matches if selectedBloc is "all" OR the user's bloc matches
    const matchesBloc =
      selectedBloc === "" ||
      selectedBloc === "all" ||
      user.bloc === selectedBloc;

    return matchesSearchTerm && matchesService && matchesBloc;
  });
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let endPage = Math.min(totalPages, startPage + pageRange - 1);

    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleViewMaterials = async (user: User) => {
    try {
      const res = await fetch(`${API_BASE}/api/materials/by-user/${user.id}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch materials");

      const data = await res.json();
      setSelectedUser(user);
      setMaterials(data);
      setIsMaterialsDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Fields to display in the dialog (in order)
  const fieldLabels = {
    codebar: "Codebar",
    marque: "Brand",
    cpu: "CPU",
    ram: "RAM",
    disk: "Disk",
    Ncpu: "Number of CPUs",
    Nram: "Number of RAM Modules",
    Ndisk: "Number of Disks",
    ecran: "Screen",
    adf: "ADF",
    clavier: "Keyboard",
    souris: "Mouse",
    usb: "USB Ports",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  // Function to filter only non-empty fields
  const getFilteredDetails = (material: Material) => {
    return Object.entries(fieldLabels)
      .filter(([key]) => {
        const value = material[key as keyof Material];
        return (
          value !== null && value !== "" && value !== undefined && value !== 0
        );
      })
      .map(([key, label]) => ({
        label,
        value: material[key as keyof Material],
      }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 group transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-xs group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  Back to Dashboard
                </span>
              </Link>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                User Management
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                Manage users who can be assigned IT assets in your organization
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNew}
                className="h-12 px-6 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingUser ? "Edit User Profile" : "Add New User"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingUser
                    ? "Update the user details below"
                    : "Fill out the form to register a new system user"}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-5 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Full Name</Label>
                    <Input
                      {...form.register("fullname")}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.fullname && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.fullname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      type="email"
                      {...form.register("email")}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Telephone</Label>
                    <Input
                      {...form.register("tel")}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.tel && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.tel.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Department</Label>
                    <Select
                      value={form.watch("service")}
                      onValueChange={(value) =>
                        form.setValue(
                          "service",
                          value as UserFormData["service"]
                        )
                      }
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Location</Label>
                    <Select
                      value={form.watch("bloc")}
                      onValueChange={(value) =>
                        form.setValue("bloc", value as UserFormData["bloc"])
                      }
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {blocOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-gray-900">
                {users.length}
              </div>
              <div className="text-sm text-green-600 flex items-center mb-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                12% from last month
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{
                  width: `${Math.min(100, (users.length / 50) * 100)}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Departments
              </CardTitle>
              <div className="p-2 rounded-lg bg-indigo-100">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-gray-900">
                {new Set(users.map((u) => u.service)).size}
              </div>
              <div className="text-sm text-blue-600 flex items-center mb-1">
                <Plus className="h-3 w-3 mr-1" />2 new this quarter
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from(new Set(users.map((u) => u.service)))
                .slice(0, 3)
                .map((service) => (
                  <span
                    key={service}
                    className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              {new Set(users.map((u) => u.service)).size > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{new Set(users.map((u) => u.service)).size - 3} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Users List
                <span className="text-sm font-medium text-gray-500">
                  ({paginatedUsers.length})
                </span>
              </CardTitle>

              <CardDescription className="text-gray-600 mt-1">
                Search and manage all users in the system
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search users by name, email, department..."
                className="pl-10 w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select
                value={selectedService}
                onValueChange={(value) => {
                  setSelectedService(value);
                  setCurrentPage(1); // Reset page on filter change
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  {/* The special 'clear filter' item with a non-empty string value */}
                  <SelectItem value="all">All Departments</SelectItem>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedBloc}
                onValueChange={(value) => {
                  setSelectedBloc(value);
                  setCurrentPage(1); // Reset page on filter change
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  {/* The special 'clear filter' item with a non-empty string value */}
                  <SelectItem value="all">All Locations</SelectItem>
                  {blocOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{user.fullname}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email ? (
                        user.email.includes(";") ? (
                          user.email.split(";").map((email, index) => (
                            <a
                              key={index}
                              href={`mailto:${email.trim()}`}
                              className="text-blue-600 hover:underline block"
                            >
                              {email.trim()}
                            </a>
                          ))
                        ) : (
                          <a
                            href={`mailto:${user.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.email}
                          </a>
                        )
                      ) : (
                        <span className="text-gray-400 italic">No email</span>
                      )}
                    </TableCell>

                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.service}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.bloc}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border border-gray-200 bg-gray-50 hover:bg-green-100"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="border border-gray-200 bg-gray-50 hover:bg-blue-100"
                          onClick={() => handleViewMaterials(user)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          View Materials
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={isMaterialsDialogOpen}
              onOpenChange={setIsMaterialsDialogOpen}
            >
              <DialogContent className="max-w-[95vw] sm:max-w-[700px] p-0 overflow-hidden rounded-xl">
                <DialogHeader className="px-6 pt-6 pb-4">
                  <div className="flex flex-col space-y-4">
                    <DialogTitle className="text-xl font-semibold flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      Equipment Assigned to{" "}
                      <span className="text-blue-600 ml-1">
                        {selectedUser?.fullname}
                      </span>
                    </DialogTitle>

                    {/* Enhanced User Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                      <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        User Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2.5">
                          <div className="flex items-start">
                            <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                Service
                              </p>
                              <p className="text-sm font-medium text-slate-800 capitalize">
                                {selectedUser?.service?.toLowerCase() ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                Bloc
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                {selectedUser?.bloc
                                  ? `Bloc ${selectedUser.bloc}`
                                  : "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-start">
                            <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                Email
                              </p>
                              {selectedUser?.email ? (
                                <a
                                  href={`mailto:${selectedUser.email}`}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                  {selectedUser.email}
                                </a>
                              ) : (
                                <p className="text-sm text-slate-500">
                                  Not provided
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                Phone
                              </p>
                              {selectedUser?.tel && selectedUser.tel.trim() ? (
                                <div className="flex flex-col gap-1">
                                  {selectedUser.tel
                                    .split(";")
                                    .map((phone, index) => {
                                      const cleanPhone = phone.trim();
                                      return (
                                        cleanPhone && (
                                          <a
                                            key={index}
                                            href={`tel:${cleanPhone}`}
                                            className="text-sm text-slate-800 hover:text-blue-600 transition-colors"
                                          >
                                            {cleanPhone}
                                          </a>
                                        )
                                      );
                                    })}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500">
                                  Not provided
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {selectedUser?.updatedAt && (
                        <p className="text-sm text-slate-400">
                          Last updated{" "}
                          {new Date(
                            selectedUser.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {selectedUser?.createdAt && (
                        <p className="text-sm text-slate-400">
                          Member since{" "}
                          {new Date(
                            selectedUser.createdAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </DialogHeader>

                {materials.length > 0 ? (
                  <div className="px-6 pb-6">
                    <div className="rounded-lg border overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead className="w-[140px] py-3.5 font-medium text-slate-700">
                              Codebar
                            </TableHead>
                            <TableHead className="py-3.5 font-medium text-slate-700">
                              Brand
                            </TableHead>
                            <TableHead className="py-3.5 font-medium text-slate-700">
                              Category
                            </TableHead>
                            <TableHead className="py-3.5 font-medium text-slate-700">
                              Subcategory
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materials.map((m) => (
                            <TableRow
                              key={m.id}
                              className="border-slate-100 hover:bg-slate-50/50 cursor-pointer"
                              onClick={() => setSelectedMaterial(m)}
                            >
                              <TableCell className="py-3.5 font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="bg-slate-100 p-1.5 rounded-md">
                                    <Barcode className="h-3.5 w-3.5 text-slate-600" />
                                  </div>
                                  <span className="font-mono text-sm">
                                    {m.codebar}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3.5">
                                {m.marque}
                              </TableCell>
                              <TableCell className="py-3.5">
                                {m.SousCategorie?.categorie?.nom}
                              </TableCell>
                              <TableCell className="py-3.5">
                                {m.SousCategorie?.nom}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary section */}
                    <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        Showing all {materials.length} items
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-blue-50/70 px-3 py-1.5 rounded-full">
                          <Laptop className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            {
                              materials.filter(
                                (m) =>
                                  m.SousCategorie?.categorie?.nom === "Computer"
                              ).length
                            }{" "}
                            Computers
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50/70 px-3 py-1.5 rounded-full">
                          <Smartphone className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            {
                              materials.filter(
                                (m) =>
                                  m.SousCategorie?.categorie?.nom === "Phone"
                              ).length
                            }{" "}
                            Phones
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-6">
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200">
                      <div className="bg-slate-100 p-4 rounded-full">
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        No equipment assigned
                      </h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        {selectedUser?.fullname} doesn't have any equipment
                        assigned yet.
                      </p>
                    </div>
                  </div>
                )}

                {/* Material Details Dialog */}
                <Dialog
                  open={!!selectedMaterial}
                  onOpenChange={() => setSelectedMaterial(null)}
                >
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Material Details</DialogTitle>
                    </DialogHeader>
                    {selectedMaterial && (
                      <div className="space-y-3 mt-3">
                        {getFilteredDetails(selectedMaterial).map(
                          (item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between border-b pb-1"
                            >
                              <span className="font-medium text-slate-700">
                                {item.label}
                              </span>
                              <span className="text-slate-600">
                                {typeof item.value === "object" &&
                                item.value !== null
                                  ? "nom" in item.value
                                    ? item.value.nom // if SousCategorie or Categorie
                                    : JSON.stringify(item.value) // fallback for unknown objects
                                  : item.value || "-"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <DialogFooter className="px-6 py-4 border-t bg-slate-50/50">
                  <div className="flex w-full justify-between items-center">
                    {selectedUser && (
                      <PdfDownloadButton
                        materials={materials}
                        user={selectedUser}
                      />
                    )}

                    <Button
                      onClick={() => setIsMaterialsDialogOpen(false)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Close
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {totalPages > 1 && (
            <div className="pt-4 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {pageNumbers[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}

                  {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="rounded-xl max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-center text-xl font-bold text-gray-900">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600">
                This will permanently delete{" "}
                <span className="font-semibold">{selectedUser?.fullname}</span>{" "}
                from the system.
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel className="px-6">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 px-6"
                onClick={handleDeleteUser}
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
