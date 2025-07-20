"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface BarcodeGeneratorProps {
  code: string;
  name: string;
  category: string;
}

export function BarcodeGenerator({
  code,
  name,
  category,
}: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [code]);

  const generateBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 120;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate simple barcode pattern (Code 128 simulation)
    const barcodeWidth = 200;
    const barcodeHeight = 50;
    const startX = (canvas.width - barcodeWidth) / 2;
    const startY = 20;

    // Draw barcode bars
    ctx.fillStyle = "black";
    const codeString = code.replace(/\./g, "");

    for (let i = 0; i < codeString.length; i++) {
      const digit = Number.parseInt(codeString[i]) || 0;
      const barWidth = 2 + (digit % 3);
      const x = startX + i * 15;

      // Draw bar
      ctx.fillRect(x, startY, barWidth, barcodeHeight);

      // Draw space
      ctx.fillStyle = "white";
      ctx.fillRect(x + barWidth, startY, 2, barcodeHeight);
      ctx.fillStyle = "black";
    }

    // Draw text
    ctx.fillStyle = "black";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(code, canvas.width / 2, startY + barcodeHeight + 15);

    ctx.font = "10px Arial";
    ctx.fillText(name, canvas.width / 2, startY + barcodeHeight + 30);
    ctx.fillText(category, canvas.width / 2, startY + barcodeHeight + 45);
  };

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `barcode-${code}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const printBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const img = canvas.toDataURL();
    printWindow.document.write(`
      <html>
        <head><title>Print Barcode - ${code}</title></head>
        <body style="margin: 0; padding: 20px; text-align: center;">
          <img src="${img}" style="max-width: 100%;" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Generated Barcode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="border border-gray-200 rounded" />
        </div>
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={downloadBarcode}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={printBarcode}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
