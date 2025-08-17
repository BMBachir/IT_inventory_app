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
  BriefcaseBusiness,
  List,
  Check,
  ListIcon,
  Building2Icon,
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
import { Checkbox } from "@/components/ui/checkbox";
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

  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
    new Set()
  );
  const [open, setOpen] = useState(false);

  const itemsPerPage = 10;
  const pageWindowSize = 5;

  const fetchData = async () => {
    try {
      const data: Material[] = await fetch(`${API_BASE}/api/materials/`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        toast.error(
          "Format de données inattendu de l'API. Impossible de charger les matériaux."
        );
        setMat([]); // Ensure 'mat' is an empty array to prevent further errors
        return; // Stop execution if data is not an array
      }
      setMat(data);
      console.log(data);
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
      toast.error("Échec du chargement des données. Veuillez réessayer.");
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
      toast.error("Échec du chargement des données initiales.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchInitialData();
  }, []);

  const filterData = mat.filter((item) => {
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
          item.user?.bloc +
          item.cpu +
          item.ram +
          item.disk +
          item.ecran +
          (item.SousCategorie?.categorie?.nom || "") +
          (item.SousCategorie?.nom || "")
        )
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    return matchService && matchBloc && matchSearch;
  });

  const filteredData = [...filterData].sort((a, b) => {
    const nameA = a.user?.fullname || "";
    const nameB = b.user?.fullname || "";
    return nameA.localeCompare(nameB);
  });

  useEffect(() => {
    setSelectedItemIds(new Set());
  }, [selectedService, selectedBloc, searchTerm]);

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
            item.user?.bloc +
            item.cpu +
            item.ram +
            item.disk +
            item.ecran +
            (item.SousCategorie?.categorie?.nom || "") +
            (item.SousCategorie?.nom || "")
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
            item.user?.bloc +
            item.cpu +
            item.ram +
            item.disk +
            item.ecran +
            (item.SousCategorie?.categorie?.nom || "") +
            (item.SousCategorie?.nom || "")
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

  const handleSelectItem = (id: number, isChecked: boolean) => {
    const newSet = new Set(selectedItemIds);
    if (isChecked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedItemIds(newSet);
  };

  const handleSelectAll = (isChecked: boolean) => {
    const newSet = new Set(selectedItemIds);
    if (isChecked) {
      currentData.forEach((item) => newSet.add(item.id));
    } else {
      currentData.forEach((item) => newSet.delete(item.id));
    }
    setSelectedItemIds(newSet);
  };

  const generateBarcodeHtmlSnippet = (
    barcodeValue: string,
    itemName: string,
    categorie: string,
    SousCategorie: string,
    isFirst: boolean
  ) => {
    const pageBreakClass = isFirst ? "" : "page-break-new-label";

    const nameDisplay =
      SousCategorie.toLowerCase() === "laptop"
        ? `${SousCategorie}-${itemName}`
        : `${SousCategorie}`;
    return `
      <div class="barcode-container ${pageBreakClass}">
        <div class="category-name">${nameDisplay}</div>
        <canvas id="barcodeCanvas-${barcodeValue}"></canvas>
        <div class="barcode-value">${barcodeValue}</div>
      </div>
    `;
  };

  const handlePrintBarcode = (
    barcodeValue: string,
    itemName: string,
    categorie: string,
    sousCategorie: string
  ) => {
    const printWindow = window.open("", "_blank", "width=200,height=150");
    if (!printWindow) {
      console.error("Failed to open print window. Please allow pop-ups.");
      toast.error("Veuillez autoriser les pop-ups pour imprimer.");
      return;
    }

    const barcodeHtml = generateBarcodeHtmlSnippet(
      barcodeValue,
      itemName,
      categorie,
      sousCategorie,
      true
    );

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @page { size: 4.5cm 3.5cm; margin: 0; }
          html, body { width: 4.5cm; height: 3.5cm; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; font-family: 'Inter', sans-serif; }
          .barcode-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 0.2cm; }
          .category-name { font-size: 10px; text-align: center; margin-bottom: 0.5cm;margin-top: 0.1cm; word-break: break-word; }
          canvas { width: 100%; height: 1.3cm; display: block; }
          .barcode-value { font-family: monospace; font-size: 10px; text-align: center; margin-top: 0.5cm; word-break: break-word; }
          .item-name { font-size: 9px; text-align: center; margin-top: 0.5cm; word-break: break-word; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
        ${barcodeHtml}
        <script>
          const canvas = document.getElementById("barcodeCanvas-${barcodeValue}");
          if (canvas) {
            JsBarcode(canvas, "${barcodeValue}", {
              format: "CODE128",
              displayValue: false,
              width: 2.5,
              height: 5,
              margin: 0,
              background: "#ffffff",
              lineColor: "#000000",
            });
          }
          setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 100);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintSelected = () => {
    if (selectedItemIds.size === 0) {
      toast.info("Veuillez sélectionner au moins un élément à imprimer.");
      return;
    }

    const selectedItems = mat.filter((item) => selectedItemIds.has(item.id));
    let allBarcodesHtml = "";

    selectedItems.forEach((item, index) => {
      allBarcodesHtml += generateBarcodeHtmlSnippet(
        item.codebar,
        item.marque,
        item.SousCategorie?.categorie?.nom || "",
        item.SousCategorie?.nom || "",
        index === 0
      );
    });

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      console.error("Failed to open print window. Please allow pop-ups.");
      toast.error("Veuillez autoriser les pop-ups pour imprimer.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Barcodes</title>
        <style>
          @page {
            size: 4.5cm 3.5cm;
            margin: 0;
          }
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
          .barcode-container {
            width: 4.5cm;
            height: 3.5cm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0.2cm;
            page-break-inside: avoid;
          }
          .page-break-new-label {
            page-break-before: always;
          }
         .category-name { font-size: 10px; text-align: center; margin-bottom: 0.5cm;margin-top: 0.1cm; word-break: break-word; }
          canvas { width: 100%; height: 1.3cm; display: block; }
              .barcode-value { font-family: monospace; font-size: 10px; text-align: center; margin-top: 0.5cm; word-break: break-word; }
          .item-name { font-size: 9px; text-align: center; margin-top: 0.1cm; word-break: break-word; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
        ${allBarcodesHtml}
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const barcodes = document.querySelectorAll('canvas');
            barcodes.forEach(canvas => {
              const id = canvas.id;
              const barcodeValue = id.replace('barcodeCanvas-', '');
              JsBarcode(canvas, barcodeValue, {
                format: "CODE128",
                displayValue: false,
                width: 2.5,
                height: 5,
                margin: 0,
                background: "#ffffff",
                lineColor: "#000000",
              });
            });
            setTimeout(() => {
              window.print();
              window.onafterprint = () => window.close();
            }, 500);
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setSelectedItemIds(new Set());
  };

  const handleMaterialUpdated = () => {
    setEditOpen(false);
    setSelectedMaterial(null);
    fetchData();
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

          <div className="relative max-w-sm w-full">
            <Input
              placeholder="Filter by marque, user, service, CPU, RAM, disk, screen, category, subcategory..."
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
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <BriefcaseBusiness className="h-4 w-4 text-gray-600" />
                <span>{selectedService || "SERVICE"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[240px] border-gray-200 shadow-md rounded-lg p-1"
            >
              <DropdownMenuItem
                onClick={() => {
                  setSelectedService("");
                  setCurrentPage(1);
                }}
                className="font-medium text-blue-600 hover:bg-blue-50"
              >
                <List className="h-4 w-4 mr-2" />
                All Services
              </DropdownMenuItem>

              {availableServices.map((service, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setSelectedService(service);
                    setCurrentPage(1);
                  }}
                  className={selectedService === service ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Building
                      className={`h-4 w-4 ${
                        selectedService === service
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        selectedService === service
                          ? "text-blue-700 font-medium"
                          : ""
                      }
                    >
                      {service}
                    </span>
                    {selectedService === service && (
                      <Check className="ml-auto h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Building2Icon className="h-4 w-4 text-gray-600" />
                <span>{selectedBloc || "BLOC"}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[240px] border-gray-200 shadow-md rounded-lg p-1"
            >
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBloc("");
                  setCurrentPage(1);
                }}
                className="font-medium text-blue-600 hover:bg-blue-50"
              >
                <ListIcon className="h-4 w-4 mr-2" />
                All Blocs
              </DropdownMenuItem>

              {availableBlocs.map((bloc, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    setSelectedBloc(bloc);
                    setCurrentPage(1);
                  }}
                  className={selectedBloc === bloc ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Building2Icon
                      className={`h-4 w-4 ${
                        selectedBloc === bloc
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        selectedBloc === bloc ? "text-blue-700 font-medium" : ""
                      }
                    >
                      {bloc}
                    </span>
                    {selectedBloc === bloc && (
                      <Check className="ml-auto h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                Materials
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[100vh] overflow-y-auto">
              <AddItemForm onAdded={fetchData} onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button
            variant={selectedItemIds.size > 0 ? "default" : "outline"}
            className={`flex items-center gap-2 transition-all ${
              selectedItemIds.size > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
            onClick={handlePrintSelected}
            disabled={selectedItemIds.size === 0}
            title={
              selectedItemIds.size > 0
                ? `Print ${selectedItemIds.size} selected items`
                : "No items selected"
            }
          >
            <Printer
              className={`h-4 w-4 ${
                selectedItemIds.size > 0 ? "text-white" : "text-blue-600"
              }`}
            />
            <span>
              Print Selection
              {selectedItemIds.size > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {selectedItemIds.size}
                </span>
              )}
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  currentData.length > 0 &&
                  selectedItemIds.size === currentData.length
                }
                onCheckedChange={(isChecked) =>
                  handleSelectAll(isChecked as boolean)
                }
                aria-label="Sélectionner tout"
              />
              <span className="font-semibold text-gray-700">
                Sélectionner la page actuelle
              </span>
            </div>
          </div>
          {currentData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <Checkbox
                checked={selectedItemIds.has(item.id)}
                onCheckedChange={(isChecked) =>
                  handleSelectItem(item.id, isChecked as boolean)
                }
                aria-label={`Sélectionner ${item.marque}`}
              />
              <div className="flex-1 ml-4">
                <div className="font-medium font-heading">{item.marque}</div>
                <div className="text-sm text-gray-600 font-body">
                  {item.SousCategorie?.categorie?.nom} &gt;{" "}
                  {item.SousCategorie?.nom}
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
                        handlePrintBarcode(
                          item.codebar,
                          item.marque,
                          item.SousCategorie?.categorie?.nom || "",
                          item.SousCategorie?.nom || ""
                        )
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
