// components/PdfDownloadButton.tsx
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfGenerator from "./PdfGenerator";
import { Material, User } from "../user-management";

export default function PdfDownloadButton({
  user,
  materials,
}: {
  user: User;
  materials: Material[];
}) {
  if (!user) return null; // optional: don't render button if no user

  return (
    <PDFDownloadLink
      document={<PdfGenerator user={user} materials={materials} />}
      fileName={`materials_${user.fullname}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          "Generating PDF..."
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
            <span>Download PDF</span>
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
