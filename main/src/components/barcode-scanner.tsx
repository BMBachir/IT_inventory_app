"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import type { Material, User as UserType } from "@/lib/inventory";

// Mock data for demonstration
const mockMaterials: (Material & { assignedUser: UserType; location: any })[] =
  [
    {
      id: "2",
      code: "B01.IT.1.2.045",
      barcode: "1234567890124",
      categoryId: 1,
      subcategoryId: 12,
      name: "HP ProLiant DL380",
      description: "Enterprise rack server for data center operations",
      brand: "HP",
      model: "ProLiant DL380 Gen10",
      specifications: {
        cpu: "Intel Xeon Silver 4214",
        ram: 64,
        storage: "2TB SAS",
        rackUnits: 2,
        powerConsumption: 800,
      },
      status: "Active",
      location: {
        id: "loc2",
        building: "Building B",
        floor: "Basement",
        room: "Data Center",
        rack: "Rack 15",
        position: "U10-U12",
      },
      assignedUserId: "2",
      assignedUser: {
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
      purchaseDate: new Date("2024-02-01"),
      warrantyExpiry: new Date("2027-02-01"),
      lastMaintenance: new Date("2024-08-01"),
      nextMaintenance: new Date("2025-02-01"),
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
    },
  ];

export function BarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedItem, setScannedItem] = useState<
    (Material & { assignedUser: UserType; location: any }) | null
  >(null);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setError("");

      // Simulate camera access (in real implementation, use getUserMedia)
      if (videoRef.current) {
        // Mock camera feed
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Draw a mock camera view
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#333";
            ctx.font = "16px Roboto";
            ctx.textAlign = "center";
            ctx.fillText(
              "Camera View",
              canvas.width / 2,
              canvas.height / 2 - 20
            );
            ctx.fillText(
              "Point camera at barcode",
              canvas.width / 2,
              canvas.height / 2 + 20
            );

            // Draw scanning line
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, canvas.height / 2);
            ctx.lineTo(canvas.width - 50, canvas.height / 2);
            ctx.stroke();
          }
        }
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    setIsScanning(false);
  };

  const searchByCode = (code: string) => {
    setError("");
    const item = mockMaterials.find(
      (item) =>
        item.code === code ||
        item.barcode === code ||
        item.name.toLowerCase().includes(code.toLowerCase())
    );

    if (item) {
      setScannedItem(item);
    } else {
      setError(`No item found with code: ${code}`);
      setScannedItem(null);
    }
  };

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      searchByCode(manualCode.trim());
    }
  };

  // Simulate barcode detection
  const simulateScan = (code: string) => {
    searchByCode(code);
    setIsScanning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Retired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          Barcode Scanner
        </h1>
        <p className="text-gray-600 font-body">
          Scan or search for items to view ownership and location details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Scan className="h-5 w-5" />
              Barcode Scanner
            </CardTitle>
            <CardDescription className="font-body">
              Use camera to scan barcodes or enter code manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Test Buttons */}

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Quick Test (Simulate Scan):
              </Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => simulateScan("B01.IT.1.2.045")}
                  className="font-mono-custom text-xs"
                >
                  Scan: B01.IT.1.2.045 (HP Server)
                </Button>
              </div>
            </div>

            <Separator />

            {/* Manual Entry */}
            <div className="space-y-2">
              <Label htmlFor="manual-code" className="font-medium">
                Manual Code Entry
              </Label>
              <div className="flex gap-2">
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter barcode or item code..."
                  className="font-mono-custom"
                  onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-body">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Package className="h-5 w-5" />
              Item Details
            </CardTitle>
            <CardDescription className="font-body">
              Detailed information about the scanned item
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedItem ? (
              <div className="space-y-6">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-semibold">
                      {scannedItem.name}
                    </h3>
                    <p className="text-gray-600 font-body">
                      {scannedItem.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="font-mono-custom">
                        {scannedItem.code}
                      </Badge>
                      <Badge className={getStatusColor(scannedItem.status)}>
                        {scannedItem.status === "Active" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {scannedItem.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Assigned User */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assigned To
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-blue-900">
                          Name
                        </Label>
                        <p className="font-body font-semibold">
                          {scannedItem.assignedUser.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-900">
                          Employee ID
                        </Label>
                        <p className="font-mono-custom">
                          {scannedItem.assignedUser.employeeId}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-900">
                          Department
                        </Label>
                        <p className="font-body">
                          {scannedItem.assignedUser.service}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-900">
                          Position
                        </Label>
                        <p className="font-body">
                          {scannedItem.assignedUser.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a
                          href={`mailto:${scannedItem.assignedUser.email}`}
                          className="text-blue-600 hover:underline font-body"
                        >
                          {scannedItem.assignedUser.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <a
                          href={`tel:${scannedItem.assignedUser.phoneNumber}`}
                          className="text-blue-600 hover:underline font-body"
                        >
                          {scannedItem.assignedUser.phoneNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-green-600" />
                        <div>
                          <Label className="text-sm font-medium text-green-900">
                            Building
                          </Label>
                          <p className="font-body">
                            {scannedItem.location.building}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-900">
                          Floor
                        </Label>
                        <p className="font-body">
                          {scannedItem.location.floor}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-900">
                          Room
                        </Label>
                        <p className="font-body">{scannedItem.location.room}</p>
                      </div>
                      {scannedItem.location.rack && (
                        <div>
                          <Label className="text-sm font-medium text-green-900">
                            Rack
                          </Label>
                          <p className="font-body">
                            {scannedItem.location.rack}
                          </p>
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-green-900">
                          Position
                        </Label>
                        <p className="font-body">
                          {scannedItem.location.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold">
                    Technical Specifications
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Brand</Label>
                        <p className="font-body">{scannedItem.brand}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Model</Label>
                        <p className="font-body">{scannedItem.model}</p>
                      </div>
                      {Object.entries(scannedItem.specifications).map(
                        ([key, value]) => (
                          <div key={key}>
                            <Label className="text-sm font-medium capitalize">
                              {key}
                            </Label>
                            <p className="font-body">
                              {typeof value === "boolean"
                                ? value
                                  ? "Yes"
                                  : "No"
                                : value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Maintenance Info */}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-body">
                  Scan a barcode or enter a code to view item details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
