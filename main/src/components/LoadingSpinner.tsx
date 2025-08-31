// components/LoadingSpinner.tsx
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-slate-400 border-r-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
