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

export function UserManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

  type UserFormData = z.infer<typeof userSchema>;
  type User = UserFormData & { id: string };
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

  // Pagination state and handlers
  const [currentPage, setCurrentPage] = useState(1);
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
              <CardTitle className="text-2xl font-bold text-gray-900">
                Users List
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
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {user.email}
                      </a>
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
                          className="border-gray-300 hover:bg-gray-50"
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
