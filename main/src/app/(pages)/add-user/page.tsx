"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftToLineIcon,
  Badge,
  CircleUserRound,
  Download,
  Edit,
  MailsIcon,
  Plus,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { toast } from "react-toastify";
import { useAuth } from "@/app/Context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
};
interface FormDataProps {
  username: string;
  email: string;
  role: string;
  password: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({
    username: "",
    email: "",
    role: "admin",
    password: "",
  });

  const { user, newUser } = useAuth();

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      newUser(data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/get-users`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      await fetch(`${API_BASE}/api/auth/delete-user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchUsers();
      toast.success("L'utilisateur a été supprimé avec succès!");
    } catch (error) {
      console.error("Error deleting utilisateur:", error);
      toast.error("Error Supprimant le utilisateur!");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 space-y-6">
        {user?.userData.role === "admin" ? (
          <div className="container mx-auto py-6 space-y-6">
            {" "}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Title Section */}
              <div className="flex items-start gap-6">
                {/* Back Button - More prominent */}

                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 group transition-all duration-300 mt-3"
                >
                  <div className="bg-transparent p-2.5 rounded-xl  border border-gray-200 group-hover:border-blue-300 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                </button>

                {/* Title Section - Better alignment */}
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-lg shadow-inner">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent">
                        IT User Management
                      </h1>
                      <p className="text-gray-600 mt-1">
                        Manage your users, their roles and permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-lg max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        Create New User
                      </DialogTitle>
                      <DialogDescription>
                        Add a new user account with the details below
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          className="focus:ring-2 focus:ring-blue-500"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          className="focus:ring-2 focus:ring-blue-500"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="focus:ring-2 focus:ring-blue-500"
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleCreateUser}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full min-w-[600px]">
                {/* Table Head */}
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" />
                        <span>User</span>
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MailsIcon className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Role</span>
                      </div>
                    </th>
                    <th className="p-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Users className="h-10 w-10 text-gray-400" />
                          <h3 className="text-gray-600 font-medium">
                            No users found
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Create your first user to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                              <CircleUserRound className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {user.email}
                          </a>
                        </td>
                        <td
                          className={`flex items-center justify-start gap-2 px-2 py-6 font-medium ${
                            user?.role === "admin"
                              ? "text-purple-700"
                              : "text-gray-700"
                          }`}
                        >
                          <Badge />
                          {user?.role ?? "No Role"}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-lg max-w-md">
                                <AlertDialogHeader>
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-full">
                                      <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <AlertDialogTitle>
                                      Confirm User Deletion
                                    </AlertDialogTitle>
                                  </div>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">
                                      {user.username}
                                    </span>
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-12 flex items-center justify-center max-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
              {user?.userData.role === "user" ? (
                <>
                  <h2 className="text-red-600 font-bold text-4xl mb-4">
                    Access Restricted
                  </h2>
                  <p className="text-gray-700 text-lg">
                    You do not have the necessary permissions to access this
                    page. <br />
                    Please contact an administrator if you believe this is a
                    mistake.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-yellow-500 font-bold text-4xl mb-4">
                    Unauthorized Access
                  </h2>
                  <p className="text-gray-700 text-lg">
                    You need proper authorization to view this content. <br />{" "}
                    Please log in with an admin account or reach out for
                    assistance.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
