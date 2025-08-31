"use client";

import { ScannerPage } from "@/components/barcode-scanner";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <ScannerPage />
      </div>
    </ProtectedRoute>
  );
};

export default page;
