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
  MapPin,
  Building2,
  Clock,
  Package,
  ChevronRight,
  User,
  Building,
  LucideTrash2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
      const data: Material[] = await fetch(`${API_BASE}/api/materials/`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
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
        fetch(`${API_BASE}/api/users/`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${API_BASE}/api/categories/`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${API_BASE}/api/sous-categories/`, {
          method: "GET",
          credentials: "include",
        }),
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

  const handleMaterialUpdated = () => {
    setEditOpen(false);
    setSelectedMaterial(null);
    fetchData(); // or reload();
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/materials/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
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
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title Section */}
          <div className="relative">
            {/* Decorative accent bar */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-full"></div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {/* Icon container with subtle shadow */}
                <div className="p-2.5 bg-blue-100 rounded-xl shadow-inner">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>

                {/* Gradient text title */}
                <CardTitle className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent">
                  Recent Items
                </CardTitle>
              </div>

              {/* Description with subtle animation */}
              <CardDescription className="text-gray-600 pl-11 transition-all duration-300 hover:text-gray-800">
                Latest additions to inventory with user assignments
              </CardDescription>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-auto md:min-w-[280px]">
              <Input
                placeholder="Filter by brand, user, department..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300"
                  >
                    <Building2 className="h-4 w-4 text-gray-600" />
                    <span>{selectedService || "Department"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px] border-gray-200 shadow-md">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedService("");
                      setCurrentPage(1);
                    }}
                    className="font-medium text-blue-600 hover:bg-blue-50"
                  >
                    All Departments
                  </DropdownMenuItem>
                  {availableServices.map((service) => (
                    <DropdownMenuItem
                      key={service}
                      onClick={() => {
                        setSelectedService(service);
                        setCurrentPage(1);
                      }}
                      className={
                        selectedService === service
                          ? "bg-gray-100 font-medium"
                          : ""
                      }
                    >
                      {service}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300"
                  >
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>{selectedBloc || "Location"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px] border-gray-200 shadow-md">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBloc("");
                      setCurrentPage(1);
                    }}
                    className="font-medium text-blue-600 hover:bg-blue-50"
                  >
                    All Locations
                  </DropdownMenuItem>
                  {availableBlocs.map((bloc) => (
                    <DropdownMenuItem
                      key={bloc}
                      onClick={() => {
                        setSelectedBloc(bloc);
                        setCurrentPage(1);
                      }}
                      className={
                        selectedBloc === bloc ? "bg-gray-100 font-medium" : ""
                      }
                    >
                      {bloc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Add Item Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Add New Inventory Item
                  </DialogTitle>
                  <DialogDescription>
                    Fill out the form to register a new item in the system
                  </DialogDescription>
                </DialogHeader>
                <AddItemForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all"
            >
              {/* Item Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.marque}
                    </h3>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <span>{item.SousCategorie?.categorie?.nom}</span>
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                      <span>{item.SousCategorie?.nom}</span>
                    </div>
                  </div>
                </div>

                {/* User Badges */}
                <div className="flex flex-wrap gap-2 pl-11">
                  {item.user?.fullname && (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      <User className="h-3 w-3 mr-1 text-gray-600" />
                      {item.user.fullname}
                    </Badge>
                  )}
                  {item.user?.service && (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      <Building className="h-3 w-3 mr-1 text-gray-600" />
                      {item.user.service}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <Badge variant="secondary" className="font-mono text-xs">
                  {item.codebar}
                </Badge>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handlePrintBarcode(item.codebar, item.marque)
                      }
                      className="hover:bg-blue-50"
                    >
                      <Printer className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print Barcode</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedMaterial(item);
                        setEditOpen(true);
                      }}
                      className="hover:bg-green-50"
                    >
                      <Edit3 className="h-4 w-4 text-green-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Item</TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Delete Item</TooltipContent>
                  </Tooltip>

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

          {/* Edit Dialog */}
          <EditMaterialDialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
            material={selectedMaterial}
            onUpdated={handleMaterialUpdated}
            users={allUsers}
            categories={allCategories}
            subcategories={allSubcategories}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
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
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentItem;
