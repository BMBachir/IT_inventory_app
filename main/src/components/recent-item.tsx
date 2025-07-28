"use client";

import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

function RecentItem() {
  const [mat, setMat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageWindowSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${API_BASE}/api/materials/`).then((res) =>
          res.json()
        );
        setMat(data);
      } catch (err) {
        console.error("Impossible de charger les données:", err);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(mat.length / itemsPerPage);
  const currentData = mat.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentWindow = Math.floor((currentPage - 1) / pageWindowSize);
  const startPage = currentWindow * pageWindowSize + 1;
  const endPage = Math.min(startPage + pageWindowSize - 1, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-3">
      {currentData.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="font-medium font-heading">{item.marque}</div>
            <div className="text-sm text-gray-600 font-body">
              {item.SousCategorie?.categorie?.nom} &gt;{" "}
              {item.SousCategorie?.nom}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs font-body">
                👤 {item.user?.fullname}
              </Badge>
              <Badge variant="outline" className="text-xs font-body">
                🏢 {item.user?.service}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="font-mono-custom text-xs">
              {item.codebar}
            </Badge>
          </div>
        </div>
      ))}

      {/* Pagination UI */}
      {totalPages > 1 && (
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

            {/* Numbered Pages in Current Window */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const page = startPage + i;
              return (
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
              );
            })}

            {endPage < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

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
      )}
    </div>
  );
}

export default RecentItem;
