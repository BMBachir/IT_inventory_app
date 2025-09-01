import { HistoryManagement } from "@/components/action-history";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <HistoryManagement />
      </div>
    </ProtectedRoute>
  );
};

export default page;
