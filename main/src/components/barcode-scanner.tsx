"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Scan,
  User,
  MapPin,
  Package,
  Building,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Search,
  History,
  Edit,
  Printer,
  ScanLine,
  Usb,
  Mouse,
  Keyboard,
  MousePointer,
  Monitor,
  HardDrive,
  MemoryStick,
  Cpu,
  CalendarDays,
  Barcode,
  Loader2,
  TestTube2,
  ArrowLeft,
} from "lucide-react";

type User = {
  id: number;
  fullname: string;
  email: string;
  service: string;
  tel: Number;
  bloc: string;
};

type Material = {
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
  accessoire: string; // added
  notes: string; // added
  userId: number;
  sousCategorieId: string;
  categorieId: string | null;
  createdAt: string;
  updatedAt: string;
  user: User | null;
  SousCategorie: any | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

export function ScannerPage() {
  const [codeInput, setCodeInput] = useState("");
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMaterial = async (code: string) => {
    if (!code.trim()) {
      setError("Veuillez entrer un code-barres.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/api/materials/${code}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Matériel non trouvé.");
      }
      const data = await res.json();
      setMaterial(data);
    } catch (err) {
      setMaterial(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!codeInput) return;

    const delayDebounce = setTimeout(() => {
      fetchMaterial(codeInput);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [codeInput]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
                Barcode Scanner
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-light max-w-md mx-auto">
              Scan or search for items to view ownership and location details
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
      {/*=============================================* left side*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <Scan className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Barcode Scanner
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Use camera to scan barcodes or enter code manually
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Test Scanner Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TestTube2 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Quick Search
                </h3>
              </div>

              <p className="text-sm text-gray-600">
                Simulate scanning with the barcodes:
              </p>
            </div>

            <Separator className="my-4" />

            {/* Manual Entry Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Keyboard className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Manual Entry
                </h3>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode or item code..."
                  className="font-mono flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />

                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                  onClick={() => fetchMaterial(codeInput)}
                  disabled={!codeInput || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">Search</span>
                </Button>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
              {loading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching for item...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/*=============================================* right side*/}
        {/* Results Section */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Item Details
                  {material && (
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700"
                    >
                      {material.SousCategorie?.nom || "Uncategorized"}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Detailed information about the scanned item
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {material ? (
              <div className="space-y-8 p-6">
                {/* Header with barcode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Barcode className="h-5 w-5 text-gray-500" />
                      {material.codebar}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      Last scanned: {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div className="bg-gray-900 text-white px-3 py-1 rounded-lg font-mono text-sm">
                    #{material.id}
                  </div>
                </div>

                {/* Assigned User */}
                {material.user && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        Assigned To
                      </h4>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Name
                          </Label>
                          <p className="text-lg font-medium">
                            {material.user.fullname}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Employee ID
                          </Label>
                          <p className="font-mono bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                            {material.user.id}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Department
                          </Label>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <p>{material.user.service || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Location
                          </Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <p>{material.user.bloc || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Email
                          </Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <a
                              href={`mailto:${material.user.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {material.user.email}
                            </a>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Telephone
                          </Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a
                              href={`tel:${material.user.tel}`}
                              className="text-blue-600 hover:underline"
                            >
                              {material.user.tel?.toString() || "Not specified"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Computer Components */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Cpu className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Computer Components
                    </h4>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Brand */}
                      {material.marque && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Brand
                          </Label>
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.marque}</p>
                          </div>
                        </div>
                      )}

                      {/* CPU */}
                      {material.cpu && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            CPU
                          </Label>
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.cpu}</p>
                          </div>
                          {material.Ncpu > 0 && (
                            <div className="mt-1 text-sm text-gray-600">
                              Quantity: {material.Ncpu}
                            </div>
                          )}
                        </div>
                      )}

                      {/* RAM */}
                      {material.ram && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            RAM
                          </Label>
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.ram}</p>
                          </div>
                          {material.Nram > 0 && (
                            <div className="mt-1 text-sm text-gray-600">
                              Modules: {material.Nram}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Disk */}
                      {material.disk && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Disk
                          </Label>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.disk}</p>
                          </div>
                          {material.Ndisk > 0 && (
                            <div className="mt-1 text-sm text-gray-600">
                              Drives: {material.Ndisk}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Screen */}
                      {material.ecran && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Screen
                          </Label>
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.ecran}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Peripheral Section */}
                {(material.clavier > 0 ||
                  material.souris > 0 ||
                  material.usb > 0 ||
                  (material.accessoire && material.accessoire.trim() !== "") ||
                  (material.notes && material.notes.trim() !== "")) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <MousePointer className="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        Peripherals
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {material.clavier > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Keyboard
                          </Label>
                          <div className="flex items-center gap-2">
                            <Keyboard className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.clavier}</p>
                          </div>
                        </div>
                      )}

                      {material.souris > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Mouse
                          </Label>
                          <div className="flex items-center gap-2">
                            <Mouse className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{material.souris}</p>
                          </div>
                        </div>
                      )}

                      {material.accessoire?.trim() && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Accessoire
                          </Label>
                          <div className="flex flex-col gap-1">
                            {material.accessoire
                              .split(";")
                              .map((item, index) => (
                                <p key={index} className="font-medium">
                                  {item.trim()}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}

                      {material.notes?.trim() && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500">
                            Notes
                          </Label>
                          <div className="flex flex-col gap-1">
                            {material.notes.split(";").map((item, index) => (
                              <p key={index} className="font-medium">
                                {item.trim()}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ADF Section */}
                {material.adf > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Printer className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        ADF (Automatic Document Feeder)
                      </h4>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">
                          Units
                        </Label>
                        <div className="flex items-center gap-2">
                          <Printer className="h-5 w-5 text-gray-500" />
                          <p className="font-medium">{material.adf}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="relative mb-6">
                  <Scan className="h-16 w-16 text-blue-500" />
                  <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 animate-pulse">
                    <ScanLine className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Scan an Item
                </h3>
                <p className="text-gray-600 max-w-md">
                  Scan a barcode or enter a code to view detailed information
                  about the item
                </p>
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 shadow-md">
                  <Scan className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </div>
            )}
          </CardContent>

          {material && (
            <CardFooter className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <History className="h-4 w-4" />
                Updated 2 hours ago
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-300">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
                <Button>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Label
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
