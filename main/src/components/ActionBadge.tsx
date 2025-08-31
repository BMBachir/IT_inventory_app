// components/ActionBadge.tsx
import React from "react";

type ActionBadgeProps = {
  actionType: string;
};

export const ActionBadge: React.FC<ActionBadgeProps> = ({ actionType }) => {
  const normalizedAction = actionType.toLowerCase();

  let colorClass = "bg-gray-100 text-gray-800";
  if (normalizedAction.includes("create")) {
    colorClass = "bg-green-100 text-green-800";
  } else if (normalizedAction.includes("update")) {
    colorClass = "bg-blue-100 text-blue-800";
  } else if (normalizedAction.includes("delete")) {
    colorClass = "bg-red-100 text-red-800";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {actionType}
    </span>
  );
};
