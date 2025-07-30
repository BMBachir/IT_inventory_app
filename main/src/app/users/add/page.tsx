import { AddUserForm } from "@/components/add-user-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <AddUserForm />
      </div>
    </ProtectedRoute>
  );
};

export default page;
