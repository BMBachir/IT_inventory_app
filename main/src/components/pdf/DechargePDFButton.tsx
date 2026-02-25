"use client";

import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { DechargePDF } from "./DechargePDF";

export function DechargePDFButton({ details, user, signature }: Props) {
  const generate = async () => {
    const blob = await pdf(
      <DechargePDF details={details} user={user} signature={signature} />,
    ).toBlob();

    saveAs(blob, "fiche-decharge-materiel.pdf");
  };

  return (
    <Button onClick={generate} className="w-full h-10">
      Générer la fiche de décharge (PDF)
    </Button>
  );
}
