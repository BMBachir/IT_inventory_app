"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, Search, Plus, Printer } from "lucide-react"; // Added Printer icon
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddItemForm } from "@/components/add-item-form";

// Load JsBarcode library dynamically
// This is done by directly injecting the script into the new window for printing
// We don't need to import it here for the main component.

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

function RecentItem() {
  const [mat, setMat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBloc, setSelectedBloc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [availableServices, setAvailableServices] = useState([]);
  const [availableBlocs, setAvailableBlocs] = useState([]);

  const itemsPerPage = 10;
  const pageWindowSize = 5;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${API_BASE}/api/materials/`).then((res) =>
          res.json()
        );
        setMat(data);
        setAvailableServices([
          ...new Set(data.map((item) => item.user?.service).filter(Boolean)),
        ]);
        setAvailableBlocs([
          ...new Set(data.map((item) => item.user?.bloc).filter(Boolean)),
        ]);
      } catch (err) {
        console.error("Impossible de charger les données:", err);
      }
    };
    fetchData();
  }, []);

  // Filtered data based on current selections
  const filteredData = mat.filter((item) => {
    const matchService =
      selectedService === "" || selectedService === null
        ? true
        : item.user?.service === selectedService;

    const matchBloc =
      selectedBloc === "" || selectedBloc === null
        ? true
        : item.user?.bloc === selectedBloc;

    const matchSearch = searchTerm
      ? (
          item.marque +
          item.codebar +
          item.user?.fullname +
          item.user?.service +
          item.user?.bloc
        )
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    return matchService && matchBloc && matchSearch;
  });

  // Effect to update available service and bloc options
  useEffect(() => {
    const servicesBasedOnOtherFilters = mat.filter((item) => {
      const matchBloc =
        selectedBloc === "" || selectedBloc === null
          ? true
          : item.user?.bloc === selectedBloc;
      const matchSearch = searchTerm
        ? (
            item.marque +
            item.codebar +
            item.user?.fullname +
            item.user?.service +
            item.user?.bloc
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      return matchBloc && matchSearch;
    });
    setAvailableServices([
      ...new Set(
        servicesBasedOnOtherFilters
          .map((item) => item.user?.service)
          .filter(Boolean)
      ),
    ]);

    const blocsBasedOnOtherFilters = mat.filter((item) => {
      const matchService =
        selectedService === "" || selectedService === null
          ? true
          : item.user?.service === selectedService;
      const matchSearch = searchTerm
        ? (
            item.marque +
            item.codebar +
            item.user?.fullname +
            item.user?.service +
            item.user?.bloc
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      return matchService && matchSearch;
    });
    setAvailableBlocs([
      ...new Set(
        blocsBasedOnOtherFilters.map((item) => item.user?.bloc).filter(Boolean)
      ),
    ]);
  }, [selectedService, selectedBloc, searchTerm, mat]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentWindow = Math.floor((currentPage - 1) / pageWindowSize);
  const startPage = currentWindow * pageWindowSize + 1;
  const endPage = Math.min(startPage + pageWindowSize - 1, totalPages);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Handles printing a barcode for a given value.
   * It opens a new window, generates the barcode on a canvas, and triggers the print dialog.
   * @param {string} barcodeValue - The value to encode in the barcode.
   * @param {string} itemName - The name of the item to display on the label.
   */
  const handlePrintBarcode = (barcodeValue, itemName) => {
    const printWindow = window.open("", "_blank", "width=200,height=150");
    if (!printWindow) {
      console.error("Failed to open print window. Please allow pop-ups.");
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Barcode</title>
      <style>
        @page {
          size: 4.5cm 3.5cm;
          margin: 0;
        }
        html, body {
          width: 4.5cm;
          height: 3.5cm;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', sans-serif;
        }
        .barcode-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0.2cm;
        }
        canvas {
          width: 100%;
          height: 2.5cm;
          display: block;
        }
        .barcode-value {
          font-family: monospace;
          font-size: 10px;
          text-align: center;
          margin-top: 0.1cm;
          word-break: break-word;
        }
        .item-name {
          font-size: 9px;
          text-align: center;
          margin-top: 0.1cm;
          word-break: break-word;
        }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    </head>
    <body>
      <div class="barcode-container">
        <canvas id="barcodeCanvas"></canvas>
        <div class="barcode-value">${barcodeValue}</div>
     
      </div>
    <script>
  window.onload = function () {
    try {
      const canvas = document.getElementById("barcodeCanvas");

      JsBarcode(canvas, "${barcodeValue}", {
        format: "CODE128",
        displayValue: false,
        width: 2.5,
        height: 50,
        margin: 0,
        background: "#ffffff",
        lineColor: "#000000",
      });

      // Petite pause pour s'assurer que le rendu est complet
      setTimeout(() => {
        window.print();
        window.onafterprint = () => window.close(); // Fermer la fenêtre automatiquement après l'impression
      }, 100); // Tu peux ajuster ce délai si nécessaire
    } catch (error) {
      document.body.innerHTML =
        '<div style="text-align:center; color:red;">Erreur génération code-barres : ' + error.message + "</div>";
    }
  };
</script>

    </body>
    </html>
  `);
    printWindow.document.close();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <CardTitle className="font-heading">Recent Items</CardTitle>
            <CardDescription className="font-body">
              Latest additions to inventory with user assignments
            </CardDescription>
          </div>

          <div className="relative max-w-sm w-full">
            <Input
              placeholder="Filter by marque, user, service..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pr-10"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                SERVICE <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div
                onClick={() => {
                  setSelectedService("");
                  setCurrentPage(1); // Reset page on filter change
                }}
                className="px-4 py-1 hover:bg-gray-100 cursor-pointer font-semibold text-blue-600"
              >
                All Services
              </div>
              {availableServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedService(service);
                    setCurrentPage(1); // Reset page on filter change
                  }}
                  className={`px-4 py-1 hover:bg-gray-100 cursor-pointer ${
                    selectedService === service ? "bg-gray-200 font-bold" : ""
                  }`}
                >
                  {service}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                BLOC <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div
                onClick={() => {
                  setSelectedBloc("");
                  setCurrentPage(1); // Reset page on filter change
                }}
                className="px-4 py-1 hover:bg-gray-100 cursor-pointer font-semibold text-blue-600"
              >
                All Blocs
              </div>
              {availableBlocs.map((bloc, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedBloc(bloc);
                    setCurrentPage(1); // Reset page on filter change
                  }}
                  className={`px-4 py-1 hover:bg-gray-100 cursor-pointer ${
                    selectedBloc === bloc ? "bg-gray-200 font-bold" : ""
                  }`}
                >
                  {bloc}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Materials
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[100vh] overflow-y-auto">
              <AddItemForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
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
                {/* Print Barcode Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePrintBarcode(item.codebar, item.marque)}
                  title="Print Barcode"
                  className="hover:bg-gray-200"
                >
                  <Printer className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          ))}

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
      </CardContent>
    </Card>
  );
}

export default RecentItem;
