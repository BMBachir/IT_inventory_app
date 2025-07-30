import ProtectedRoute from "@/components/ProtectedRoute";
import { UserManagement } from "@/components/user-management";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <UserManagement />
      </div>
    </ProtectedRoute>
  );
};

export default page;
