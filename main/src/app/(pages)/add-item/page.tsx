import { AddItemForm } from "@/components/add-item-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <AddItemForm />
      </div>
    </ProtectedRoute>
  );
};

export default page;
