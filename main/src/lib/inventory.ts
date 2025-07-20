// Enhanced Data Structure with User Management

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phoneNumber: string;
  service: string; // Department/Service
  bloc: string; // Building/Block
  position: string; // Job title
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialCategory {
  id: number;
  code: string; // "1", "2", "3", etc.
  name: string;
  description: string;
  icon: string;
  subcategories: MaterialSubcategory[];
}

export interface MaterialSubcategory {
  id: number;
  categoryId: number;
  code: string; // "1.1", "1.2", "1.3", etc.
  name: string;
  description: string;
  specifications: SpecificationTemplate[];
}

export interface SpecificationTemplate {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  options?: string[]; // for select type
  unit?: string; // for number type (GB, MHz, etc.)
}

export interface Material {
  id: string;
  code: string; // Generated: "1.1.001", "1.2.045", etc.
  barcode: string; // Generated barcode
  categoryId: number;
  subcategoryId: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  specifications: { [key: string]: any };
  status: "Active" | "Maintenance" | "Retired" | "Lost";
  location: Location;
  assignedUserId: string; // Required - each material must have a user
  assignedUser?: User; // Populated user data
  purchaseDate: Date;
  warrantyExpiry?: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  building: string;
  floor: string;
  room: string;
  rack?: string;
  position?: string;
}

// Hierarchical Structure Definition (same as before)
export const INVENTORY_STRUCTURE: MaterialCategory[] = [
  {
    id: 1,
    code: "1",
    name: "Computer",
    description: "Computing devices and servers",
    icon: "Computer",
    subcategories: [
      {
        id: 11,
        categoryId: 1,
        code: "1.1",
        name: "Central Unit",
        description: "Desktop computers and workstations",
        specifications: [
          { id: "cpu", name: "CPU", type: "text", required: true },
          {
            id: "ram",
            name: "RAM",
            type: "number",
            required: true,
            unit: "GB",
          },
          { id: "storage", name: "Storage", type: "text", required: true },
          {
            id: "os",
            name: "Operating System",
            type: "select",
            required: true,
            options: ["Windows 10", "Windows 11", "Linux", "macOS"],
          },
        ],
      },
      {
        id: 12,
        categoryId: 1,
        code: "1.2",
        name: "Rack Server",
        description: "Rack-mounted servers",
        specifications: [
          { id: "cpu", name: "CPU", type: "text", required: true },
          {
            id: "ram",
            name: "RAM",
            type: "number",
            required: true,
            unit: "GB",
          },
          { id: "storage", name: "Storage", type: "text", required: true },
          {
            id: "rackUnits",
            name: "Rack Units",
            type: "number",
            required: true,
            unit: "U",
          },
          {
            id: "powerConsumption",
            name: "Power Consumption",
            type: "number",
            required: false,
            unit: "W",
          },
        ],
      },
      {
        id: 13,
        categoryId: 1,
        code: "1.3",
        name: "Tower Server",
        description: "Tower-style servers",
        specifications: [
          { id: "cpu", name: "CPU", type: "text", required: true },
          {
            id: "ram",
            name: "RAM",
            type: "number",
            required: true,
            unit: "GB",
          },
          { id: "storage", name: "Storage", type: "text", required: true },
          {
            id: "redundantPSU",
            name: "Redundant PSU",
            type: "boolean",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "2",
    name: "Imaging",
    description: "Imaging and printing devices",
    icon: "Camera",
    subcategories: [
      {
        id: 21,
        categoryId: 2,
        code: "2.1",
        name: "Printer",
        description: "Printing devices",
        specifications: [
          {
            id: "printType",
            name: "Print Type",
            type: "select",
            required: true,
            options: ["Laser", "Inkjet", "Thermal"],
          },
          {
            id: "color",
            name: "Color Support",
            type: "boolean",
            required: true,
          },
          {
            id: "ppm",
            name: "Pages Per Minute",
            type: "number",
            required: false,
            unit: "ppm",
          },
        ],
      },
      {
        id: 22,
        categoryId: 2,
        code: "2.2",
        name: "Scanner",
        description: "Document scanners",
        specifications: [
          {
            id: "resolution",
            name: "Resolution",
            type: "number",
            required: true,
            unit: "DPI",
          },
          {
            id: "adf",
            name: "Auto Document Feeder",
            type: "boolean",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    code: "3",
    name: "Monitoring",
    description: "Display and monitoring equipment",
    icon: "Monitor",
    subcategories: [
      {
        id: 31,
        categoryId: 3,
        code: "3.1",
        name: "Display",
        description: "Monitors and displays",
        specifications: [
          {
            id: "screenSize",
            name: "Screen Size",
            type: "number",
            required: true,
            unit: "inches",
          },
          {
            id: "resolution",
            name: "Resolution",
            type: "select",
            required: true,
            options: ["1920x1080", "2560x1440", "3840x2160"],
          },
          {
            id: "panelType",
            name: "Panel Type",
            type: "select",
            required: false,
            options: ["IPS", "TN", "VA", "OLED"],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    code: "4",
    name: "Network",
    description: "Networking equipment",
    icon: "Network",
    subcategories: [
      {
        id: 41,
        categoryId: 4,
        code: "4.1",
        name: "Switch",
        description: "Network switches",
        specifications: [
          {
            id: "ports",
            name: "Number of Ports",
            type: "number",
            required: true,
          },
          {
            id: "speed",
            name: "Port Speed",
            type: "select",
            required: true,
            options: ["100Mbps", "1Gbps", "10Gbps"],
          },
          { id: "managed", name: "Managed", type: "boolean", required: true },
        ],
      },
      {
        id: 42,
        categoryId: 4,
        code: "4.2",
        name: "Router",
        description: "Network routers",
        specifications: [
          { id: "wanPorts", name: "WAN Ports", type: "number", required: true },
          { id: "lanPorts", name: "LAN Ports", type: "number", required: true },
          {
            id: "wireless",
            name: "Wireless Support",
            type: "boolean",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    code: "5",
    name: "Communication",
    description: "Communication devices",
    icon: "Radio",
    subcategories: [
      {
        id: 51,
        categoryId: 5,
        code: "5.1",
        name: "Phone",
        description: "IP phones and communication devices",
        specifications: [
          {
            id: "phoneType",
            name: "Phone Type",
            type: "select",
            required: true,
            options: ["IP Phone", "Analog Phone", "Wireless Phone"],
          },
          {
            id: "lines",
            name: "Number of Lines",
            type: "number",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: 6,
    code: "6",
    name: "Energy",
    description: "Power and energy equipment",
    icon: "Zap",
    subcategories: [
      {
        id: 61,
        categoryId: 6,
        code: "6.1",
        name: "UPS",
        description: "Uninterruptible Power Supply",
        specifications: [
          {
            id: "capacity",
            name: "Capacity",
            type: "number",
            required: true,
            unit: "VA",
          },
          {
            id: "batteryBackup",
            name: "Battery Backup Time",
            type: "number",
            required: false,
            unit: "minutes",
          },
        ],
      },
      {
        id: 62,
        categoryId: 6,
        code: "6.2",
        name: "PDU",
        description: "Power Distribution Unit",
        specifications: [
          {
            id: "outlets",
            name: "Number of Outlets",
            type: "number",
            required: true,
          },
          {
            id: "maxLoad",
            name: "Maximum Load",
            type: "number",
            required: true,
            unit: "A",
          },
        ],
      },
    ],
  },
];

// Barcode Generation Logic
export interface BarcodeConfig {
  prefix: string; // Company prefix
  categoryCode: string; // "1", "2", etc.
  subcategoryCode: string; // "1", "2", etc.
  sequentialNumber: string; // "001", "002", etc.
  checkDigit?: string; // Optional check digit
}

export function generateMaterialCode(
  categoryCode: string,
  subcategoryCode: string,
  sequentialNumber: number
): string {
  const paddedSequential = sequentialNumber.toString().padStart(3, "0");
  return `${categoryCode}.${subcategoryCode}.${paddedSequential}`;
}

export function generateBarcode(config: BarcodeConfig): string {
  // Example: Company prefix (123) + Category (1) + Subcategory (1) + Sequential (001)
  return `${config.prefix}${config.categoryCode}${config.subcategoryCode}${config.sequentialNumber}`;
}
