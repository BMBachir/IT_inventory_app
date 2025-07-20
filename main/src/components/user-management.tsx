"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, UserPlus, Eye } from "lucide-react";

import Link from "next/link";
import { User } from "@/lib/inventory";

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    phoneNumber: "+1234567890",
    service: "IT Department",
    bloc: "Building A",
    position: "System Administrator",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phoneNumber: "+1234567891",
    service: "Data Center",
    bloc: "Building B",
    position: "Network Engineer",
    isActive: true,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phoneNumber: "+1234567892",
    service: "Finance",
    bloc: "Building A",
    position: "Financial Analyst",
    isActive: true,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    phoneNumber: "+1234567893",
    service: "Network Team",
    bloc: "Building C",
    position: "Network Specialist",
    isActive: false,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
          : user
      )
    );
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
        <Link href="/users/add">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-body">
              {users.filter((u) => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-body">
              Inactive Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-body">
              {users.filter((u) => !u.isActive).length}
            </div>
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
                placeholder="Search users by name, email, service, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-body"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Employee ID</TableHead>
                  <TableHead className="font-body">Name</TableHead>
                  <TableHead className="font-body">Email</TableHead>
                  <TableHead className="font-body">Service</TableHead>
                  <TableHead className="font-body">Bloc</TableHead>
                  <TableHead className="font-body">Position</TableHead>
                  <TableHead className="font-body">Status</TableHead>
                  <TableHead className="font-body">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono-custom">
                      {user.employeeId}
                    </TableCell>
                    <TableCell className="font-medium font-body">
                      {user.name}
                    </TableCell>
                    <TableCell className="font-body">{user.email}</TableCell>
                    <TableCell className="font-body">{user.service}</TableCell>
                    <TableCell className="font-body">{user.bloc}</TableCell>
                    <TableCell className="font-body">{user.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className="font-body"
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className={
                            user.isActive
                              ? "text-red-600 font-body"
                              : "text-green-600 font-body"
                          }
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 font-body"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-body">
              No users found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
