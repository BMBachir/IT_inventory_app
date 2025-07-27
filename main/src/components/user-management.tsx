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
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw,
  UserPlus,
  Search,
  Edit2,
  Edit2Icon,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
// Mock users data

const userSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  tel: z
    .string()
    .length(10, { message: "Telephone must be exactly 10 digits." })
    .regex(/^\d+$/, { message: "Telephone must be numeric." }),
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
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

  type UserFormData = {
    fullname: string;
    email: string;
    tel: string;
    service:
      | "PROD"
      | "SUPPLY"
      | "IT"
      | "MG"
      | "HR"
      | "TECH"
      | "COMM"
      | "MRK"
      | "DFC"
      | "HSE"
      | "SECRT"
      | "QUALITE"
      | "CERTILAB";
    bloc:
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "H1"
      | "H2"
      | "H3"
      | "H4";
  };
  type User = UserFormData & { id: string };

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
      const res = await fetch(`${API_BASE}/api/users/`);
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
    form.reset({
      fullname: "",
      email: "",
      tel: "",
      service: "IT",
      bloc: "1",
    });
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 font-body">
            Manage users who can be assigned IT assets
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                Fill out the form to add a new user to the system.
              </DialogDescription>
            </DialogHeader>

            {/* Form starts */}
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4 mt-4"
            >
              <div>
                <Label>Full Name</Label>
                <Input {...form.register("fullname")} />
                {form.formState.errors.fullname && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.fullname.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Telephone</Label>
                <Input {...form.register("tel")} />
                {form.formState.errors.tel && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.tel.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Service</Label>
                <Select
                  value={form.watch("service")}
                  onValueChange={(value) =>
                    form.setValue("service", value as UserFormData["service"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
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

              <div>
                <Label>Bloc</Label>
                <Select
                  value={form.watch("bloc")}
                  onValueChange={(value) =>
                    form.setValue("bloc", value as UserFormData["bloc"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bloc" />
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

              <DialogFooter>
                <Button type="submit">
                  {editingUser ? "Update" : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-body">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-body">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-body">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-body">
              {new Set(users.map((u) => u.service)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Users List</CardTitle>
          <CardDescription className="font-body">
            Search and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, service..."
                className="pl-10 font-body"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">ID</TableHead>
                  <TableHead className="font-body">Name</TableHead>
                  <TableHead className="font-body">Email</TableHead>
                  <TableHead className="font-body">Service</TableHead>
                  <TableHead className="font-body">Bloc</TableHead>

                  <TableHead className="font-body">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((user) =>
                    [user.fullname, user.email, user.service]
                      .join(" ")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-body">{user.id}</TableCell>
                      <TableCell className="font-body">
                        {user.fullname}
                      </TableCell>
                      <TableCell className="font-body">{user.email}</TableCell>
                      <TableCell className="font-body">
                        {user.service}
                      </TableCell>
                      <TableCell className="font-body">{user.bloc}</TableCell>

                      <TableCell className="space-x-2">
                        <Button
                          className="bg-green-500 hover:bg-green-600  rounded-full text-white"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit3 /> Edit
                        </Button>

                        <Button
                          className="bg-red-500 hover:bg-red-600  rounded-full text-white"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the user.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
