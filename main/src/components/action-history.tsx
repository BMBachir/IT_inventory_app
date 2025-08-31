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
import { Search, History, ListX } from "lucide-react";
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
  const itemsPerPage = 10;
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
    [filteredHistories.length, itemsPerPage]
  );

  const paginatedHistories = useMemo(() => {
    return filteredHistories.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
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
    [histories]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <History className="h-8 w-8 text-slate-800" /> Action History
          </h1>
          <p className="mt-1 text-slate-600">
            Audit log of all changes made to users and materials.
          </p>
        </div>
      </div>

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b p-4">
          <CardTitle>History Logs</CardTitle>
          <CardDescription>
            Browse and filter through the entire action history.
          </CardDescription>
          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
            <Input
              type="date"
              className="w-full sm:w-auto"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Done By</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
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
                    <TableRow key={idx} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {h.entityType}
                      </TableCell>
                      <TableCell>{h.entity?.label || "N/A"}</TableCell>
                      <TableCell>
                        <ActionBadge actionType={h.actionType} />
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
                      <TableCell className="text-right text-sm text-slate-500">
                        {formatDate(h.date)}
                      </TableCell>
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
