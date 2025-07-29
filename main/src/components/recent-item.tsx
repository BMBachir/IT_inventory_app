"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronDown,
  Search,
  Plus,
  Printer,
  Edit3,
  Trash2Icon,
} from "lucide-react";
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
import EditMaterialDialog from "./EditMaterialDialog";
import { toast } from "sonner";
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
} from "./ui/alert-dialog";

export type Material = {
  id: number;
  codebar: string;
  marque: string;
  cpu: string;
  ram: string;
  disk: string;
  Ncpu: number;
  Nram: number;
  Ndisk: number;
  ecran: string;
  adf: number;
  clavier: number;
  souris: number;
  usb: number;
  userId: number;
  sousCategorieId: string;
  categorieId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    fullname?: string;
    service?: string;
    bloc?: string;
  };

  SousCategorie?: {
    nom: string;
    categorie?: {
      nom: string;
    };
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

function RecentItem() {
  const [mat, setMat] = useState<Material[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBloc, setSelectedBloc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [availableBlocs, setAvailableBlocs] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const itemsPerPage = 10;
  const pageWindowSize = 5;

  const fetchData = async () => {
    try {
      const data: Material[] = await fetch(`${API_BASE}/api/materials/`).then(
        (res) => res.json()
      );
      setMat(data);

      setAvailableServices([
        ...new Set(
          data.map((item) => item.user?.service).filter(Boolean) as string[]
        ),
      ]);

      setAvailableBlocs([
        ...new Set(
          data.map((item) => item.user?.bloc).filter(Boolean) as string[]
        ),
      ]);
    } catch (err) {
      console.error("Impossible de charger les données:", err);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [usersRes, categoriesRes, subcategoriesRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/`),
        fetch(`${API_BASE}/api/categories/`),
        fetch(`${API_BASE}/api/sous-categories/`), // ✅ this matches your backend
      ]);

      const users = await usersRes.json();
      const categories = await categoriesRes.json();
      const subcategories = await subcategoriesRes.json();

      setAllUsers(users);
      setAllCategories(categories);
      setAllSubcategories(subcategories);
    } catch (error) {
      console.error("Erreur lors du chargement des données initiales:", error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchData();
    fetchInitialData();
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
          .filter((service): service is string => typeof service === "string")
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
        blocsBasedOnOtherFilters
          .map((item) => item.user?.bloc)
          .filter((bloc): bloc is string => typeof bloc === "string")
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
  const handlePrintBarcode = (barcodeValue: string, itemName: string) => {
    const barcodeWidth = 531;
    const barcodeHeight = 413;

    const printWindow = window.open("", "_blank", "width=400,height=300");
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
            size: auto; /* auto is the initial value */
            margin: 0mm; /* this affects the margin in the printer settings */
          }
          body {
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 10mm; /* Add some padding for visual separation if needed */
            box-sizing: border-box;
          }
          .barcode-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc; /* Optional: for visual debugging of sticker area */
            padding: 5px;
            box-sizing: border-box;
            width: ${barcodeWidth}px;
            height: ${barcodeHeight}px;
            overflow: hidden; /* Ensure barcode doesn't overflow container */
          }
          canvas {
            max-width: 100%;
            height: auto;
            display: block; /* Remove extra space below canvas */
          }
          .item-name {
            font-size: 12px;
            margin-top: 5px;
            text-align: center;
            word-break: break-all; /* Break long words */
          }
          .barcode-value {
            font-family: 'monospace';
                font-size: 20px; 
                margin-top: 10px;
                text-align: center;
                width: 100%; /* Occuper toute la largeur disponible */
                box-sizing: border-box;
                padding: 0 2px;
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
          window.onload = function() {
            try {
              JsBarcode("#barcodeCanvas", "${barcodeValue}", {
                format: "CODE128", // Or "EAN13", "UPC", etc. based on your barcode type
                displayValue: false, // Do not display human-readable text below barcode (we add it separately)
                width: 2, // Bar width
                height: 50, // Bar height
                margin: 0, // No margin around the barcode itself
                background: "#ffffff", // White background
                lineColor: "#000000", // Black lines
              });
              // Give a small delay for rendering before printing
              setTimeout(() => {
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
              }, 500);
            } catch (error) {
              console.error("Error generating barcode:", error);
              // Display a simple error message in the print window if barcode generation fails
              printWindow.document.body.innerHTML = '<div style="text-align:center; color: red;">Error generating barcode: ' + error.message + '</div>';
            }
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleMaterialUpdated = () => {
    setEditOpen(false);
    setSelectedMaterial(null);
    fetchData(); // or reload();
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/materials/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Matériel supprimé !");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erreur lors de la suppression.");
    }
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
              <div className="flex items-center space-x-2">
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

                <Button
                  variant="ghost"
                  size="icon"
                  title="Éditer"
                  className="hover:bg-green-100"
                  onClick={() => {
                    setSelectedMaterial(item);
                    setEditOpen(true);
                  }}
                >
                  <Edit3 className="h-5 w-5 text-green-600" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Supprimer"
                      className="hover:bg-red-100"
                    >
                      <Trash2Icon className="h-5 w-5 text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirmer la suppression
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera définitivement ce matériel.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          <EditMaterialDialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
            material={selectedMaterial}
            onUpdated={handleMaterialUpdated}
            users={allUsers}
            categories={allCategories}
            subcategories={allSubcategories}
          />

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
