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
import { Checkbox } from "@/components/ui/checkbox";

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
        fetch(`${API_BASE}/api/sous-categories/`),
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

  useEffect(() => {
    fetchData();
    fetchInitialData();
  }, []);

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
    isFirst: boolean
  ) => {
    const pageBreakClass = isFirst ? "" : "page-break-new-label";
    return `
      <div class="barcode-container ${pageBreakClass}">
        <canvas id="barcodeCanvas-${barcodeValue}"></canvas>
        <div class="barcode-value">${barcodeValue}</div>
      </div>
    `;
  };

  // La fonction handlePrintBarcode n'est plus appelée par le composant, mais elle reste définie au cas où.
  const handlePrintBarcode = (barcodeValue: string, itemName: string) => {
    const printWindow = window.open("", "_blank", "width=200,height=150");
    if (!printWindow) {
      console.error("Failed to open print window. Please allow pop-ups.");
      return;
    }

    const barcodeHtml = generateBarcodeHtmlSnippet(
      barcodeValue,
      itemName,
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
          canvas { width: 100%; height: 2.5cm; display: block; }
          .barcode-value { font-family: monospace; font-size: 10px; text-align: center; margin-top: 0.1cm; word-break: break-word; }
          .item-name { font-size: 9px; text-align: center; margin-top: 0.1cm; word-break: break-word; }
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
              height: 50,
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
          canvas { width: 100%; height: 2.5cm; display: block; }
          .barcode-value { font-family: monospace; font-size: 10px; text-align: center; margin-top: 0.1cm; word-break: break-word; }
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
              // CORRECTION: Extraction correcte de la valeur du code-barres de l'ID du canvas
              const id = canvas.id;
              const barcodeValue = id.replace('barcodeCanvas-', '');
              console.log("barcode:", barcodeValue);
              JsBarcode(canvas, barcodeValue, {
                format: "CODE128",
                displayValue: false,
                width: 2.5,
                height: 50,
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
              <Button variant="outline">
                SERVICE <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div
                onClick={() => {
                  setSelectedService("");
                  setCurrentPage(1);
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
                    setCurrentPage(1);
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
                  setCurrentPage(1);
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
                    setCurrentPage(1);
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

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrintSelected}
            disabled={selectedItemIds.size === 0}
            title="Imprimer les éléments sélectionnés"
          >
            <Printer className="h-4 w-4" />
            Imprimer la sélection ({selectedItemIds.size})
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
                {/* Bouton d'impression individuelle supprimé ici */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePrintBarcode(item.codebar, item.marque)}
                  title="Print Barcode"
                  className="hover:bg-gray-200"
                >
                  <Printer className="h-4 w-4 text-gray-600" />
                </Button> */}

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
