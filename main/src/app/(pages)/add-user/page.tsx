"use client";

import { useEffect, useState } from "react";
import { CircleUserRound, Download, Plus, Search } from "lucide-react";
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

// Mock user data

type User = {
  _id: string;
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
export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({
    username: "",
    email: "",
    role: "user",
    password: "",
  });
  const { user, newUser } = useAuth();
  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
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
      const response = await fetch("http://localhost:5001/api/auth/get-users", {
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
      await fetch(`http://localhost:5001/api/auth/delete-user/${userId}`, {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  IT User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage your users, their roles and permissions.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                      <DialogDescription>
                        Créez un nouveau compte utilisateur avec les détails
                        ci-dessous.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                        <Input
                          id="username"
                          type="text"
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                          id="password"
                          type="password"
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateUser}>
                        Créer un utilisateur
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
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full overflow-x-auto rounded-lg border border-gray-300 shadow-md">
              <table className="w-full border-collapse">
                {/* Table Head */}
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left hidden md:table-cell">Role</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td className="p-5 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="p-3 flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-white">
                            <CircleUserRound />
                          </div>
                          {user.username}
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 hidden md:table-cell">
                          {user.role}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="rounded-full px-4 py-2 text-sm text-center transition bg-red-600 hover:bg-red-700 text-white"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Make changes to the user account.
                  </DialogDescription>
                </DialogHeader>
                {editingUser && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select>
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select>
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
