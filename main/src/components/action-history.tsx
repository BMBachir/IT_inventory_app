"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, History, ListX, ArrowLeft } from "lucide-react";
import { ActionBadge } from "./ActionBadge"; // Helper component
import { LoadingSpinner } from "./LoadingSpinner"; // Helper component

// A helper to format dates consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function HistoryManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;
  const [histories, setHistories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [doneByFilter, setDoneByFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const pageRange = 5;

  const fetchHistories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/history/all`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch histories");
      const data = await res.json();
      setHistories(data);
    } catch (err) {
      setError("Error fetching history logs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  // Memoize filtering to prevent recalculation on every render
  const filteredHistories = useMemo(() => {
    return histories.filter((h) => {
      const matchesSearch = [
        h.entityType,
        h.entity?.label,
        h.entity?.owner,
        h.doneBy,
        h.actionType,
        h.champ,
        h.old,
        h.new,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesEntity =
        entityFilter !== "all" ? h.entityType === entityFilter : true;
      const matchesDoneBy =
        doneByFilter !== "all" ? h.doneBy === doneByFilter : true;
      const matchesDate = dateFilter
        ? new Date(h.date).toISOString().slice(0, 10) === dateFilter
        : true;

      return matchesSearch && matchesEntity && matchesDoneBy && matchesDate;
    });
  }, [histories, searchTerm, entityFilter, doneByFilter, dateFilter]);

  // Memoize pagination calculations
  const totalPages = useMemo(
    () => Math.ceil(filteredHistories.length / itemsPerPage),
    [filteredHistories.length, itemsPerPage],
  );

  const paginatedHistories = useMemo(() => {
    return filteredHistories.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredHistories, currentPage, itemsPerPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let endPage = Math.min(totalPages, startPage + pageRange - 1);

    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages, pageRange]);

  const doneByOptions = useMemo(
    () => Array.from(new Set(histories.map((h) => h.doneBy))),
    [histories],
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}

      <div className="relative">
        <div className="flex items-center justify-between">
          {/* Return Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 rounded-xl shadow-sm border border-gray-200 group-hover:border-blue-300 transition-colors">
              <ArrowLeft className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
              Back
            </span>
          </button>

          {/* Title Area */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold  bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                Action History
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-light max-w-md mx-auto">
              Audit log of all changes made to users and materials.
            </p>
          </div>

          {/* Spacer to balance layout */}
          <div className="w-24"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10">
          <div className="relative">
            <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-300 opacity-30"></div>
          </div>
        </div>

        <div className="absolute top-12 left-0 -z-10">
          <div className="relative">
            <div className="absolute top-0 left-8 w-16 h-16 rounded-full bg-blue-100 opacity-40"></div>
            <div className="absolute top-8 left-0 w-12 h-12 rounded-full bg-indigo-200 opacity-30 blur-md"></div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                History Logs
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Browse and filter through the entire action history.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search all fields..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset page on new search
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select
                value={entityFilter}
                onValueChange={(value) => {
                  setEntityFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={doneByFilter}
                onValueChange={(value) => {
                  setDoneByFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Done By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {doneByOptions.map((u, idx) => (
                    <SelectItem key={idx} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-auto max-h-96">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50 sticky top-0 z-20 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Old Value
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Value
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Done By
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <TableRow className="hover:bg-gray-50">
                    <TableCell
                      colSpan={8}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      <LoadingSpinner />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-64 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginatedHistories.length > 0 ? (
                  paginatedHistories.map((h, idx) => (
                    <TableRow
                      key={idx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-black-500"
                    >
                      <TableCell className="font-medium">
                        {h.entityType}
                      </TableCell>
                      <TableCell>{h.entity?.label || "N/A"}</TableCell>
                      <TableCell>
                        <ActionBadge actionType={h.actionType} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500">
                        {formatDate(h.date)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {h.champ || "-"}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {h.old || "-"}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {h.new || "-"}
                      </TableCell>
                      <TableCell>{h.doneBy}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <ListX className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-2 text-lg font-semibold">
                        No Results Found
                      </h3>
                      <p className="text-slate-500">
                        Try adjusting your search or filter criteria.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
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
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}
