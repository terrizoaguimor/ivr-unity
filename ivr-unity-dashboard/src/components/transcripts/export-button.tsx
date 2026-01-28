"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExportButtonProps {
  startDate?: string;
  endDate?: string;
  agentId?: string;
}

export function ExportButton({ startDate, endDate, agentId }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setSuccess(false);

    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (agentId) params.set("agentId", agentId);

      const queryString = params.toString();
      const url = `/api/transcripts/export${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to export");
      }

      // Get filename from response headers or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "transcripciones.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(true);
      toast.success("Exportación completada", {
        description: `Archivo ${filename} descargado`,
      });

      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error al exportar", {
        description: "No se pudieron exportar las transcripciones",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : success ? (
        <Check className="w-4 h-4 mr-2 text-emerald-500" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {exporting ? "Exportando..." : success ? "Descargado" : "Exportar CSV"}
    </Button>
  );
}
