// components/SignaturePad.tsx
"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

type Props = {
  onSave: (signature: string | null) => void;
};

export default function SignaturePad({ onSave }: Props) {
  const sigRef = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigRef.current?.clear();
    onSave(null);
  };

  const save = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      onSave(null);
      return;
    }

    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    onSave(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="border rounded-lg bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: 300,
            height: 200,
            className: "w-full h-[200px]",
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={clear}>
          Effacer
        </Button>
        <Button onClick={save}>Valider la signature</Button>
      </div>
    </div>
  );
}
